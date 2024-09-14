import { Chat } from "@/Chat/Chat";
import { ChatIntro } from "@/Chat/ChatIntro";
import { Layout } from "@/Layout";
import { SignInForm } from "@/SignInForm";
import { UserMenu } from "@/components/UserMenu";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { MainBoard } from "@/MainBoard/MainBoard";
import { AudioSTT } from "@/AudioSTT";

export default function App() {
  const user = useQuery(api.users.viewer);
  return (
    <Layout
      menu={
        <Authenticated>
          <UserMenu>{user?.name ?? user?.email}</UserMenu>
        </Authenticated>
      }
    >
      <>
        <Authenticated>
          <AudioSTT/>
          <MainBoard/>
          <></> {/* Placeholder */}
          {/* <ChatIntro />
          <Chat viewer={(user ?? {})._id!} /> */}
        </Authenticated>
        <Unauthenticated>
          <></> {/* Placeholder */}
          {/* <SignInForm /> */}
        </Unauthenticated>
      </>
    </Layout>
  );
}
