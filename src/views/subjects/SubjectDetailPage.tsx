"use client";

import SubjectDetail from "@/components/modules/subject/SubjectDetail";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { deleteSubject } from "@/services/subjectService";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

function paramId(value: string | string[] | undefined): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value) && value[0]) return value[0];
  return "";
}

export default function SubjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const subjectId = paramId(params?.subjectId);
  const canManage = user?.role === "ADMIN" || user?.role === "TUTOR";
  const isAdmin = user?.role === "ADMIN";
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!subjectId) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center bg-[#f8f7f4] p-8">
        <div className="max-w-md rounded-xl border border-dashed border-[#e4e1d8] bg-white px-6 py-10 text-center">
          <p className="text-[15px] font-medium text-[#0f1f3d]">
            Invalid subject
          </p>
          <p className="mt-2 text-[13px] text-[#8896a8]">
            This link may be broken or the subject was removed.
          </p>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/subjects">Back to subjects</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this subject? This cannot be undone.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteSubject(subjectId);
      router.push("/subjects");
    } catch (err: unknown) {
      setDeleteError(
        err instanceof Error ? err.message : "Something went wrong",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <div className="border-b border-[#e4e1d8] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 w-fit text-[#4a5568] hover:text-[#0f1f3d]"
          >
            <Link href="/subjects" className="gap-2">
              <ArrowLeft className="size-4" />
              All subjects
            </Link>
          </Button>
          {canManage ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/dashboard/subjects/${subjectId}/edit`}
                  className="gap-1.5"
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Link>
              </Button>
              {isAdmin ? (
                <Button
                  variant="destructive"
                  size="sm"
                  type="button"
                  disabled={deleting}
                  onClick={handleDelete}
                  className="gap-1.5"
                >
                  <Trash2 className="size-3.5" />
                  {deleting ? "Deleting…" : "Delete"}
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>
        {deleteError ? (
          <div className="mx-auto max-w-6xl px-4 pb-4 md:px-6">
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
              {deleteError}
            </p>
          </div>
        ) : null}
      </div>
      <SubjectDetail subjectId={subjectId} />
    </div>
  );
}
