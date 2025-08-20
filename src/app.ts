import { defineOperationApp } from '@directus/extensions-sdk';

export default defineOperationApp({
	id: 'kafka-operation',
	name: 'Kafka Operation',
	icon: "rocketchat",
	description: 'Send or receive messages from Apache Kafka',
	overview: ({ operation, topic, host, port }) => [
		{
			label: 'Operation',
			text: operation || 'Not configured',
		},
		{
			label: 'Broker',
			text: `${host}:${port}`,
		},
		{
			label: 'Topic',
			text: topic || 'Not configured',
		},
	],
	options: [
		{
			field: 'operation',
			name: 'Operation Type',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Produce', value: 'produce' },
						{ text: 'Consume', value: 'consume' },
					],
				},
			},
		},
		{
			field: 'host',
			name: 'Host',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: true,
			},
			schema: {
				default_value: 'localhost',
			},
		},
		{
			field: 'port',
			name: 'Port',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				required: true,
			},
			schema: {
				default_value: 9092,
			},
		},
		{
			field: 'topic',
			name: 'Topic',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: true,
			},
		},
		{
			field: 'groupId',
			name: 'Consumer Group ID',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: false,
				options: {
					placeholder: 'directus-kafka-group',
				},
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'consume',
							},
						},
						hidden: false,
					},
				],
			},
			schema: {
				default_value: 'directus-kafka-group',
			},
		},
		{
			field: 'fromBeginning',
			name: 'Read from Beginning',
			type: 'boolean',
			meta: {
				width: 'half',
				interface: 'boolean',
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'consume',
							},
						},
						hidden: false,
					},
				],
			},
			schema: {
				default_value: false,
			},
		},
		{
			field: 'maxMessages',
			name: 'Max Messages',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'consume',
							},
						},
						hidden: false,
					},
				],
			},
		},
		{
			field: 'key',
			name: 'Message Key',
			type: 'string',
			meta: {
				width: 'half',
				interface: 'input',
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'produce',
							},
						},
						hidden: false,
					},
				],
			},
		},
		{
			field: 'partition',
			name: 'Partition',
			type: 'integer',
			meta: {
				width: 'half',
				interface: 'input',
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'produce',
							},
						},
						hidden: false,
					},
				],
			},
			schema: {
				default_value: 0,
			},
		},
		{
			field: 'headers',
			name: 'Headers',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					language: 'json',
					placeholder: JSON.stringify({ key: 'value' }, null, 2),
				},
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'produce',
							},
						},
						hidden: false,
					},
				],
			},
		},
		{
			field: 'message',
			name: 'Message',
			type: 'json',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					language: 'json',
					placeholder: JSON.stringify({ message: 'Hello Kafka!' }, null, 2),
				},
				required: false,
				conditions: [
					{
						rule: {
							operation: {
								_eq: 'produce',
							},
						},
						hidden: false,
					},
				],
			},
		},
		{
			field: 'transform',
			name: 'Transform Function',
			type: 'text',
			meta: {
				width: 'full',
				interface: 'input-code',
				options: {
					language: 'javascript',
					placeholder: `// Transform function to modify the payload before sending to Kafka
					// Available for both produce and consume operations
					// Example: return { ...data, timestamp: new Date().toISOString() };
					return data;`,
				},
				required: false,
			},
		},
	],
});
