import { Dialog, DialogContent, CircularProgress } from "@mui/material";
import { useRecoilState } from "recoil";
import DropFileUpload from "../components/DropFileUpload";
import { GlobalLoadingAtom } from "../store/recoilStore";

function GlobalLoading() {
  const [state, setState] = useRecoilState(GlobalLoadingAtom);

  return (
    <div>
      <Dialog
        open={state}
        PaperProps={{ sx: { borderRadius: "12px" }, className: "shadow-md" }}>
        <DialogContent className="flex flex-col justify-center items-center h-full w-full ">
          <CircularProgress size={"4rem"} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Index({ className }: { className?: string }) {
  return (
    <>
      <GlobalLoading></GlobalLoading>
      <DropFileUpload
        requestDataProps={{
          url: "/api/FileBrowser/upload_file/",
          method: "POST",
          params: {
            directory: "/tmp",
          },
        }}>
        <div className="h-screen w-screen flex items-center justify-center">
          <div className="w-96 h-48  border-blue-200 border-dashed border-1 rounded-sm flex items-center justify-center bg-slate-100">
            Drop file here.
          </div>
        </div>
      </DropFileUpload>
    </>
  );
}
