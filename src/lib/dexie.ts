import Dexie, { Table } from "dexie";
import { nanoid } from "nanoid";

// Interface untuk Dexie Table (Table Declaration)
interface DEX_Thread {
  id: string; // nanoid
  title: string; //nama thread
  created_at: Date; //Waktu thread dibikin
  updated_at: Date; //Sort sidebar dengan thread terakhir yg ada message
}

interface DEX_Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  thought: string;
  created_at: Date;
  thread_id: string;
}

class ChatDB extends Dexie {
  threads!: Table<DEX_Thread>; //Fixed(!)
  messages!: Table<DEX_Message>;

  constructor() {
    super("chattestdb"); //Nama Database

    this.version(1).stores({
      threads: "id, title, created_at, updated_at",
      messages: "id, role, content, thought, created_at, thread_id",
    });

    // Function hook (triggered ketika sebuah thread kebuat)
    this.threads.hook("creating", (_, obj) => {
      // _ = key, obj(data baru yg akan masuk ke db)
      obj.created_at = new Date();
      obj.updated_at = new Date();
    });

    this.messages.hook("creating", (_, obj) => {
      obj.created_at = new Date();
    });
  }

  async createThread(title: string) {
    const id = `id-${nanoid(16)}`;

    await this.threads.add({
      id,
      title,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return id;
  }

  async getAllThreads() {
    return this.threads.reverse().sortBy("updated_at");
  }

  async createMessage(
    message: Pick<DEX_Message, "content" | "role" | "thought" | "thread_id">
  ) {
    const messageId = `msg-${nanoid(16)}`;

    // 1. buat message
    // 2. update thread (updated_at) menjadi paling atas di sidebar
    await this.transaction("rw", [this.threads, this.messages], async () => {
      await this.messages.add({
        id: messageId,
        // ...message,
        content: message.content,
        role: message.role,
        thread_id: message.thread_id,
        thought: message.thought,
        created_at: new Date(),
      });

      await this.threads.update(message.thread_id, {
        updated_at: new Date(),
      });
    });

    return messageId;
  }

  async getMessageForThread(threadId: string) {
    return this.messages
      .where("thread_id")
      .equals(threadId)
      .sortBy("created_at");
  }
}

export const db = new ChatDB();
