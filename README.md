# Kafka Operation Extension for Directus

This extension provides Kafka integration for Directus Flows, allowing you to produce and consume messages from Apache Kafka.

## Features

- **Produce Messages**: Send messages to Kafka topics with customizable payloads
- **Consume Messages**: Read messages from Kafka topics with filtering options
- **Custom Transformations**: Transform messages before sending or after receiving
- **Flexible Configuration**: Configure host, port, topics, and other Kafka parameters
- **Headers Support**: Add custom headers to messages
- **Partition Control**: Specify partition for message distribution

## Installation

1. Copy the `kafka-operation` folder to your Directus `extensions` directory
2. Run `npm install` in the extension directory
3. Build the extension with `npm run build`
4. Restart your Directus instance

## Usage

### Producing Messages

1. Create a new Flow in Directus
2. Add the "Kafka Operation" operation
3. Set Operation Type to "Produce"
4. Configure:
   - Host and Port of your Kafka broker
   - Target topic name
   - Message payload (JSON)
   - Optional: Message key, partition, headers
   - Optional: Transform function to modify payload

### Consuming Messages

1. Create a new Flow in Directus
2. Add the "Kafka Operation" operation
3. Set Operation Type to "Consume"
4. Configure:
   - Host and Port of your Kafka broker
   - Source topic name
   - Consumer group ID
   - Optional: Read from beginning, max messages
   - Optional: Transform function to process received messages

## Configuration Options

### Common Options
- **Operation Type**: Choose between "produce" or "consume"
- **Host**: Kafka broker host (default: localhost)
- **Port**: Kafka broker port (default: 9092)
- **Topic**: Kafka topic name

### Produce Options
- **Message Key**: Optional key for message partitioning
- **Partition**: Target partition (default: 0)
- **Headers**: Custom headers as JSON object
- **Message**: The message payload as JSON

### Consume Options
- **Consumer Group ID**: Consumer group identifier
- **Read from Beginning**: Start reading from earliest message
- **Max Messages**: Maximum messages to consume

### Transform Function
Both operations support a JavaScript transform function that receives the data and should return the transformed data.

Example:
```javascript
// For produce: modify message before sending
return {
  ...data,
  processedAt: new Date().toISOString(),
  source: 'directus'
};

// For consume: process received message
return {
  ...data,
  receivedAt: new Date().toISOString()
};
```

## Development

```bash
cd extensions/kafka-operation
npm install
npm run dev
```

## Dependencies

- `kafkajs`: Kafka client library
- `@directus/extensions-sdk`: Directus extension development kit
