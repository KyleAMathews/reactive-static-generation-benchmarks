# reactive-static-generation-benchmarks
Benchmarks for testing Reactive Static Generation vs SSG/SSR

# Ecommerce benchmark

|   | p50  | p75  | p99  | 
|---|---|---|---|
| Gatsby Cloud RSG	|1.3s	|1.7s	|4.1s |
| Netlify Gatsby SSG	|124s	|132s	|152s |
| Remix/Fastly — maxAge	|30s	|30s	|30s |
| Remix/Fastly — revalidate	|0.4s	|0.48s	|0.6s |
| Next.js/Vercel — revalidate	|0.97s|	4.1s	|8.4s |

<img width="599" alt="Screen Shot 2022-08-10 at 12 46 27 PM" src="https://user-images.githubusercontent.com/71047/184431623-57091d91-2bc5-4bf9-a37b-84a6d82a0de1.png">
