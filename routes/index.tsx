/// <reference lib="deno.unstable" />

export default async function Home() {

  const kv = await Deno.openKv();
  for (let i = 0; i < 5000; i++) {
    kv.set(["hello", i], "かきくけこ".repeat(200));
  }
  kv.set(["hello", 100], "あいうえお");
  kv.set(["hello", 1000], "あいうえお1");

  console.log(await kv.get(["hello", 100]));
  const result = await kv.get(["hello", 1000]).then((value) => {
    return value;
  });
  console.log(result.value);
  const res = [];
  const pat = /あいう/;
  const beforeKv = performance.now();
  const iter = kv.list({ prefix: ["hello"] });
  for await (const item of iter) {
    const value = item.value;
    if (pat.test(value)) {
      res.push(value);
    }
  }
  const afterKv = performance.now();
  console.log(res);
  console.log(afterKv - beforeKv);

  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src="/logo.svg"
          width="128"
          height="128"
          alt="the Fresh logo: a sliced lemon dripping with juice"
        />
        <h1 class="text-4xl font-bold">Welcome to Fresh</h1>
        <p class="my-4">
          Try updating this message in the
          <code class="mx-2">./routes/index.tsx</code> file, and refresh.
        </p>
        <div>
          <p class="my-4">
            {`Time: ${afterKv - beforeKv}`}
          </p>
          <p class="my-4">
            {`${res}`}
          </p>
        </div>
      </div>
    </div>
  );
}
