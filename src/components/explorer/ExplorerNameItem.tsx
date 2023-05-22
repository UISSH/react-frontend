import FolderIcon from "@mui/icons-material/Folder";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import { useSnackbar } from "notistack";
import { useNavigate, useSearchParams } from "react-router-dom";
import FileMenu from "./FileMenu";
import FolderMenu from "./FolderMenu";

interface RowIF {
  type: "directory" | "regular" | string;
  filename: string;
  path: string;
  directory: string;
}

interface ExplorerNameItemProps {
  row: RowIF;
}
export default function ExplorerNameItem(props: ExplorerNameItemProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const row = props.row;
  return (
    <div className="cursor-pointer flex gap-1 justify-between items-center ">
      <div
        className=" flex gap-1 items-center"
        onClick={(e) => {
          e.stopPropagation();
          if (row.type == "directory") {
            setSearchParams({
              directory: row.path,
            });
          } else {
            navigate(`/dash/editor/`, {
              state: {
                type: "vim",
                path: row.path,
              },
            });
          }
        }}>
        {row.type == "directory" ? (
          <FolderIcon></FolderIcon>
        ) : (
          <TextSnippetIcon></TextSnippetIcon>
        )}
        <div> {row.filename}</div>
      </div>
      <div className="invisible group-hover:visible">
        {row.type == "regular" ? (
          <FileMenu
            name={row.filename}
            directory={row.directory}
            path={row.path}
          />
        ) : (
          <FolderMenu
            name={row.filename}
            directory={row.directory}
            path={row.path}
          />
        )}
      </div>
    </div>
  );
}
