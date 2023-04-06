import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import useSWR from "swr";
import { requestData } from "../../requests/http";

export interface ResponseIF {
  pagination: PaginationIF;
  results: ResultIF[];
}

interface ResultIF {
  ID: number;
  To: string;
  Action: string;
  From: string;
}

interface PaginationIF {
  total_pages: number;
  total: number;
  page: number;
  per_page: number;
}

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default function IPTablesIndex() {
  const { data, error, isLoading } = useSWR<ResponseIF>(
    "/api/IPTables/get_rules/",
    async (url) => {
      let data = await requestData({
        url: url,
        method: "GET",
      });
      return (await data.json()) as ResponseIF;
    }
  );

  if (error) return <div>"An error has occurred."</div>;
  if (isLoading) return <div>"Loading..."</div>;

  console.log(data);
  return (
    <TableContainer component={Paper} className=" shadow-none">
      <Table size="small" aria-label="simple table" className="">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>To</TableCell>
            <TableCell>Action</TableCell>
            <TableCell align="right">From</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.results &&
            data.results.map((row) => (
              <TableRow
                key={row.ID}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.ID}
                </TableCell>
                <TableCell>{row.To}</TableCell>
                <TableCell>{row.Action}</TableCell>
                <TableCell align="right">{row.From}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
