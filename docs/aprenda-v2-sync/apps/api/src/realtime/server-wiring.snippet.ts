// Wiring do Socket.io no serviço `api`.
//
// O objetivo é anexar o Socket.io ao MESMO servidor HTTP que a api já expõe,
// para o Railway continuar com um único serviço/porta e o healthcheck /health
// seguir funcionando. Adapte os nomes ao arquivo de bootstrap existente.

import { createServer } from "node:http";
import { Server } from "socket.io";
import { prisma } from "database";
import { createQuizGateway } from "./quiz-gateway";

// `app` é o Express/Fastify handler que a api já usa hoje.
export function startApiWithRealtime(app: (req: unknown, res: unknown) => void, port: number) {
  const httpServer = createServer(app as never);

  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.WEB_ORIGIN ?? "https://aprendaaqui.up.railway.app"],
      credentials: true,
    },
  });

  createQuizGateway(io, prisma);

  httpServer.listen(port, () => {
    console.log(`api + realtime ouvindo na porta ${port}`);
  });

  return httpServer;
}

// Se a api usa Express e hoje faz `app.listen(port)`, troque por:
//
//   startApiWithRealtime(app, Number(process.env.PORT ?? 3001));
