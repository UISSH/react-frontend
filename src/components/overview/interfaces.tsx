export default interface OsqueryResult {
  doc: string;
  action: string;
  sql: string;
  message: Message;
  code: number;
}

interface Message {
  out: Out[];
  err: string;
}
interface Out {
  [key: string]: string;
}
