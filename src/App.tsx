import { Chat } from "@/Chat/Chat";
import { ChatIntro } from "@/Chat/ChatIntro";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { MainBoard } from "@/MainBoard/MainBoard";
import { STT } from "@/STT";
import { TTS } from "@/TTS";
import { useState } from "react";

export default function App() {
  const [restartCount, setRestartCount] = useState(0);

  const user = useQuery(api.users.viewer);
  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
      setRestartCount={setRestartCount}
    >
      <>
        <Authenticated>
          <STT restartCount={restartCount} />
          <TTS/>
          <MainBoard/>
          <></> {/* Placeholder */}
          {/* <ChatIntro />
          <Chat viewer={(user ?? {})._id!} /> */}
        </Authenticated>
        <Unauthenticated>
          <></> {/* Placeholder */}
          <SignInForm />
        </Unauthenticated>
      </>
    </Layout>
  );
}
