import { z } from "zod";

export const messageStatusSchema = z.enum(["nao_lida", "lida", "arquivada"]);
