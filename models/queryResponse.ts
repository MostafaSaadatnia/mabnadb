import { List } from "../types/list";

export default interface QueryResponse {
    data?: List;
    message: string;
}