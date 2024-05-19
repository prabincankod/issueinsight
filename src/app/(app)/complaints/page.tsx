import SignOutBtn from "@/components/auth/SignOutBtn";
import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import { getUserAuth } from "@/lib/auth/utils";
import { api } from "@/lib/trpc/api";
import { useState } from "react";
import MainComplaint from "./MainPage";

export default async  function  Home() {
//   const complaints = await api.computers.getComplaints.query();
const { session } = await getUserAuth();

  return (
    <main className="">
      {/* <div className="flex flex-row justify-between "> */}
        <MainComplaint session={session} />
      {/* </div> */}
    </main>
  );
}
