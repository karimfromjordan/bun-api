import { functions, schemas } from "./functions";

const server = Bun.serve({
  async fetch(req) {
    const url = new URL(req.url);

    try {
      const path_array = url.pathname.substring(5).split(".");
      const fn = path_array.reduce((prev, curr) => prev?.[curr], functions);

      if (!fn) throw new Error("not_found", { cause: { status: 404 } });

      let params;

      switch (request.headers.get("content-type")?.split(";")[0]) {
        case undefined:
          params = Object.fromEntries(url.searchParams.entries());
          break;

        case "application/json":
          params = await request.json();
          break;

        case "application/x-www-form-urlencoded":
          params = Object.fromEntries(
            await request.formData().then((d) => d.entries())
          );
          break;

        case "multipart/form-data":
          params = Object.fromEntries(
            await request.formData().then((d) => d.entries())
          );
          break;

        case "application/octet-stream": {
          if (url.pathname !== "/files.upload") {
            throw new Error("unsupported_media_type", {
              cause: { status: 415 },
            });
          }
        }

        default:
          throw new Error("unsupported_media_type", { cause: { status: 415 } });
      }

      const schema = path_array.reduce((prev, curr) => prev?.[curr], schemas);

      try {
        parse(schema, params);
      } catch (error) {
        throw new Error("bad_request", { cause: { status: 400 } });
      }

      if (!schema) throw new Error("im_a_teapot", { cause: { status: 418 } });

      const { body, headers } = await fn(params, locals);

      return new Response(
        JSON.stringify(body, (key, value) => {
          if (["password_hash", "metadata"].includes(key)) return;
        }),
        { headers }
      );
    } catch (error) {
      return new Response(error.message ?? "error", {
        status: error?.cause?.status ?? 500,
      });
    }
  },
});

console.log(`Listening on http://${server.hostname}:${server.port}...`);
