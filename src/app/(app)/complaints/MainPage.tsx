"use client";

import { DataTable } from "@/components/ui/DataTable";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";

import { useState } from "react";
import AddCategoryForm from "./AddComplaint";
import { trpc } from "@/lib/trpc/client";
import EditCategoryForm from "./EditComplaint";
import { Badge } from "@/components/ui/badge";

// @ts-ignore
const MainComplaint = ({ session }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const complaints = trpc.computers.getComplaints.useQuery();
  // @ts-ignore
  const user = trpc.computers.getUserById.useQuery({ id: session.user.id });
  return (
    <>
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold  my-2">Complaints</h1>
        <Button
          onClick={() => {
            setIsAddModalOpen(true);
          }}
        >
          Create Complaint
        </Button>
      </div>

      {user.data?.usertype === "Student" ? (
        <DataTable
          data={complaints.data ?? []}
          columns={[
            {
              accessorKey: "id",
              header: "Id",
            },

            {
                accessorKey: "name",
                header: "Name",
              },
            {
                accessorKey: "status",
                header: "Status",
                cell(props) {
                  return (
                    <>
{props.row.original.status}
                    </>
                  );
                },
              },
          ]}
          loading={complaints.isLoading}
          // actions={[
          //   {
          //     action: "edit",
          //     handleAction: (row) => {
          //       setEditingId(row.id);
          //     },
          //   },
          // ]}
        />
      ) : (
        <DataTable
          data={complaints.data ?? []}
          columns={[
            {
              accessorKey: "id",
              header: "Id",
            },
            {
              accessorKey: "name",
              header: "Name",
            },
            {
              accessorKey: "status",
              header: "Status",
              cell(props) {
                return (
                  <>
{props.row.original.status}
                  </>
                );
              },
            },
          ]}
          loading={complaints.isLoading}
          actions={[
            {
              action: "edit",
              handleAction: (row) => {
                setEditingId(row.id);
              },
            },
          ]}
        />
      )}

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
        }}
        title="Create Complaint"
      >
        <AddCategoryForm
          onSuccessFulSubmit={async () => {
            setIsAddModalOpen(false);
            await complaints.refetch();
          }}
        />
      </Modal>

      {editingId && (
        <Modal
          isOpen={editingId != null}
          onClose={() => {
            setEditingId(null);
          }}
          title="Edit Complaint"
        >
          <EditCategoryForm
            id={editingId}
            onSuccessFulSubmit={async () => {
              setEditingId(null);
              await complaints.refetch();
            }}
          />
        </Modal>
      )}
    </>
  );
};
export default MainComplaint;
