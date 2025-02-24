import Dexie, { Table } from 'dexie';
import { nanoid } from 'nanoid';

// Interface untuk Dexie Table (Table Declaration)
interface DEX_Thread {
  id: string; // nanoid
  title: string; //nama thread
  created_at: Date; //Waktu thread dibikin
  updated_at: Date; //Sort sidebar dengan thread terakhir yg ada message
}

class ChatDB extends Dexie {
  threads!: Table<DEX_Thread>; //Fixed(!)

  constructor() {
    super("chattestdb"); //Nama Database

    this.version(1).stores({
      threads: "id, title, created_at, updated_at"
    })

    // Function hook (triggered ketika sebuah thread kebuat)
    this.threads.hook("creating", (_, obj) => { // _ = key, obj(data baru yg akan masuk ke db)
      obj.created_at = new Date();
      obj.updated_at = new Date();
    })
  }

  async createThread(title: string) {
    const id = `id-${nanoid(16)}`;

    await this.threads.add({
        id,
        title,
        created_at: new Date(),
        updated_at: new Date(),
    })

    return id;
  }

  async getAllThreads() {
    return this.threads.reverse().sortBy("updated_at");
  }
}

export const db = new ChatDB();