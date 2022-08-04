export default async function (req: Request): Promise<Response> {
    const response = await req.text() || "hello world";
    return new Response(response);
}
