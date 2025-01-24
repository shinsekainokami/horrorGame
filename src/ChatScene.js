import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true
});

export default class ChatScene extends Phaser.Scene {
  constructor() {
    super('ChatScene');
    this.messages = []; // Stores chat history
    this.messageHistory = []
    this.chatHeight = 300; // Fixed height for chat box
    this.chatWidth = 700;
  }

  init(data) {
    this.npcId = data.npcId || 'Unknown NPC';
    this.npcImage = data.npcImage || 'npc'; // Default NPC image key
    this.messageHistory = [
        { role: 'system', content: data.npcPrompt },
    ]
  }

  preload() {
    // Preload assets if needed
    this.load.image('npc', 'assets/npc_large.png'); // Example NPC image
  }

  async create() {
    // Background and NPC image
    this.add.rectangle(400, 300, 800, 600, 0x222222); // Background
    this.add.image(400, 150, this.npcImage).setScale(2); // NPC image

    // Chat area
    this.chatBox = this.add.rectangle(400, 400, 750, 300, 0x333333).setOrigin(0.5, 0.5);
    this.chatText = this.add.text(50, 250, '', {
      fontSize: '16px',
      color: '#ffffff',
      wordWrap: { width: this.chatWidth},
    });

    const maskShape = this.make.graphics({});
    maskShape.fillStyle(0xffffff);
    maskShape.fillRect(
      this.chatBox.x - this.chatBox.width / 2, // Left position
      this.chatBox.y - this.chatBox.height / 2, // Top position
      this.chatBox.width, // Width
      this.chatHeight // Height
    );

    const mask = maskShape.createGeometryMask();
    this.chatText.setMask(mask);

    // Input box
    this.inputBox = this.add.rectangle(400, 550, 750, 40, 0x444444).setOrigin(0.5, 0.5);
    this.inputText = this.add.text(60, 535, '', {
      fontSize: '16px',
      color: '#ffffff',
    });

    // Add keyboard listener
    this.input.keyboard.on('keydown', (event) => this.handleInput(event));

    // First message from the NPC
    // this.addMessage('npc', `Hello, I'm ${this.npcId}. How can I help you today?`);
  }

  addMessage(sender, content) {
    this.messages.push({ sender, content });
    this.messageHistory.push({
        role: sender === 'npc' ? 'assistant' : 'user',
        content
    })
    this.updateChatDisplay();
  }

  updateChatDisplay() {
    this.chatText.setText(
      this.messages
        .map((msg) => `${msg.sender === 'npc' ? 'NPC:' : 'You:'} ${msg.content}`)
        .join('\n')
    );

    const textHeight = this.chatText.height;

    // Only show the part that fits within the chat box
    if (textHeight > this.chatHeight) {
      this.chatText.y = 300 - (textHeight - this.chatHeight);
    } else {
      this.chatText.y = 300;
    }
  }

  async handleInput(event) {
    const key = event.key;

    if (key === 'Backspace') {
      this.inputText.setText(this.inputText.text.slice(0, -1));
    } else if (key === 'Enter') {
      const playerMessage = this.inputText.text.trim();
      if (playerMessage) {
        this.addMessage('player', playerMessage);
        this.inputText.setText('');
        await this.getNpcResponse(playerMessage);
      }
    } else if (key.length === 1) {
      this.inputText.setText(this.inputText.text + key);
    }
  }

  async getNpcResponse(playerMessage) {
    try {
      const chatCompletion = await client.chat.completions.create({
        messages: [
          ...this.messageHistory,
          { role: 'user', content: playerMessage },
        ],
        model: 'gpt-4o',
      });

      const npcResponse = chatCompletion.choices[0].message.content;
      this.addMessage('npc', npcResponse);
    } catch (error) {
      console.error('Error fetching NPC response:', error);
      this.addMessage('npc', 'Sorry, I had trouble responding.');
    }
  }
}
