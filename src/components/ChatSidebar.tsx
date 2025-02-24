import { Moon, Plus, Sun } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as SidebarPrimitive,
} from "~/components/ui/sidebar";
import { useTheme } from "./ThemeProvider";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { db } from "~/lib/dexie";
import { useLiveQuery } from 'dexie-react-hooks';

//dummy data
// const chatGroups = [
//   { id: "1", name: "React Basics" },
//   { id: "2", name: "AI Ethics" },
//   { id: "3", name: "Climate Change" },
//   { id: "4", name: "JavaScript Tips" },
//   { id: "5", name: "Machine Learning Intro" },
// ];

export const ChatSidebar = () => {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [dialogIsOpen, setDialogIsOpen] = useState(false); //toggle dialog kebuka || ketutup
  const [textInput, setTextInput] = useState("");

  const { setTheme, theme } = useTheme();

  const threads = useLiveQuery(() => db.getAllThreads(), []); //trigger seperti useEffect

  const handleToggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const handleCreateThread = async () => {
    const threadId = await db.createThread(textInput);

    setDialogIsOpen(false);
    setTextInput(""); //reset input
  };

  return (
    // react fragment
   <>
   {/* following state true || false */}
   <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}> 
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Buat thread baru</DialogTitle>
      </DialogHeader>
  
        <div className='space-y-1'>
          <Label htmlFor="thread-title">Judul thread</Label>
          {/* React Input Handling */}
          <Input id="thread-title" value={textInput} onChange={(e) => {
            setTextInput(e.target.value);
          }}
          placeholder="Judul thread baru anda"
          />
        </div>
 
      <DialogFooter>
        {/* Tutup Dialog */}
        <Button variant="secondary" onClick={() => setDialogIsOpen(false)}>
          Batal
        </Button>
        <Button onClick={handleCreateThread}>Buat Thread</Button>
      </DialogFooter>
    </DialogContent>
   </Dialog>
     <SidebarPrimitive>
      <SidebarHeader>
        {/* Klik Button untuk membuka dialog */}
        <Button onClick={() => setDialogIsOpen(true)} className="w-full justify-start" variant="ghost">
          <Plus className="mr-2 h-4 w-4" />
          Percakapan Baru
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Percakapan Terbaru</SidebarGroupLabel>
            <SidebarMenu>
              {/* kumpulan thread di sidebar */}
              {/* threads? menandakan awalan kosong */}
              {threads?.map((thread) => (
                <SidebarMenuItem key={thread.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveChat(thread.id)}
                    isActive={activeChat === thread.id}
                  >
                    {thread.title}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={handleToggleTheme}
          variant="ghost"
          className="w-full justify-start"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />{" "}
          Beralih Tema
        </Button>
      </SidebarFooter>
     </SidebarPrimitive>
   </>
  );
};
