import { defineOperationApi } from '@directus/extensions-sdk';
import { Kafka, Producer, Consumer } from 'kafkajs';

type Options = {
	operation: 'produce' | 'consume';
	host: string;
	port: number;
	topic: string;
	message?: any;
	key?: string;
	partition?: number;
	headers?: Record<string, string>;
	groupId?: string;
	fromBeginning?: boolean;
	maxMessages?: number;
	transform?: string;
};

export default defineOperationApi<Options>({
	id: 'kafka-operation',

	handler: async ({ operation, host, port, topic, message, key, partition, headers, groupId, fromBeginning, maxMessages, transform }) => {
		const kafka = new Kafka({
			clientId: 'directus-kafka-operation',
			brokers: [`${host}:${port}`],
		});

		if (operation === 'produce') {
			const producer: Producer = kafka.producer();
			await producer.connect();

			let payload = message;

			// Apply transformation if provided
			if (transform) {
				try {
					const transformFn = new Function('data', transform);
					payload = transformFn(message);
				} catch (error) {
					throw new Error(`Transform function error: ${error}`);
				}
			}

			const record = {
				topic,
				messages: [{
					key: key || null,
					value: JSON.stringify(payload),
					partition: partition || 0,
					headers: headers || {},
				}],
			};

			await producer.send(record);
			await producer.disconnect();

			return {
				success: true,
				operation: 'produce',
				topic,
				message: payload,
			};
		} else if (operation === 'consume') {
			const consumer: Consumer = kafka.consumer({
				groupId: groupId || 'directus-kafka-group',
			});

			await consumer.connect();
			await consumer.subscribe({ topic, fromBeginning: fromBeginning || false });

			const messages: any[] = [];
			let messageCount = 0;

			await consumer.run({
				eachMessage: async ({ message: kafkaMessage }) => {
					const value = kafkaMessage.value ? JSON.parse(kafkaMessage.value.toString()) : null;
					
					let transformedMessage = value;
					if (transform) {
						try {
							const transformFn = new Function('data', transform);
							transformedMessage = transformFn(value);
						} catch (error) {
							console.error('Transform function error:', error);
						}
					}

					messages.push({
						key: kafkaMessage.key?.toString(),
						value: transformedMessage,
						headers: kafkaMessage.headers,
						timestamp: kafkaMessage.timestamp,
					});

					messageCount++;
					if (maxMessages && messageCount >= maxMessages) {
						await consumer.stop();
					}
				},
			});

			// Wait a bit for messages to be processed
			await new Promise(resolve => setTimeout(resolve, 1000));
			await consumer.disconnect();

			return {
				success: true,
				operation: 'consume',
				topic,
				messages,
				count: messages.length,
			};
		}

		throw new Error('Invalid operation type. Use "produce" or "consume".');
	},
});
