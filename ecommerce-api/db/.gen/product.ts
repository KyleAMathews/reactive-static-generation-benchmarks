export default async function(req) {
    const response = await req.text() || "hello world";
    return new Response(response);
};
