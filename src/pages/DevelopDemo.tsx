import DropFileUpload from "../components/DropFileUpload";

export default function Index({ className }: { className?: string }) {
  return (
    <>
      <DropFileUpload>
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="w-96 h-48  border-blue-200 border-dashed border-1 rounded-sm flex items-center justify-center bg-slate-100">
            Drop file here.
          </div>
        </div>
      </DropFileUpload>
    </>
  );
}
