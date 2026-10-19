# Цэмбий

Хивс, буйдан, матрас, сандлын цэвэрлэгээний вэбсайт: нэг нүүр хуудас, сагс ба захиалгын урсгал, админ.
Ажлын хүрээ: [TSEMBII-CLAUDE-BRIEF.md](TSEMBII-CLAUDE-BRIEF.md).

## Локал ажиллуулах

Шаардлага: Node 22+, Docker.

```sh
npm install
npm run db:up                 # PostgreSQL → localhost:5433
cp .env.example .env          # SEED_OWNER_* -ийг бөглөнө
npm run db:migrate            # хүснэгтүүд
npm run db:seed               # бүрэн эрхтэй админ, холбоо барих мэдээлэл, эхний 4 үйлчилгээ
npm run dev                   # http://localhost:3100
```

Админ: http://localhost:3100/admin (`SEED_OWNER_EMAIL` / `SEED_OWNER_PASSWORD`).

### Утас баталгаажуулалт (Verify.mn)

`VERIFYMN_API_KEY` хоосон бол **туршилтын горим**: SMS илгээгдэхгүй, захиалгын хуудсанд
«Туршилт: баталгаажуулах» товч гарна. Production дээр түлхүүргүй бол баталгаажуулалт ажиллахгүй
(туршилтын горим хориотой). Бодит түлхүүрийг verify.mn-ийн Developer Console-оос авна.

## Админ

- **Бүрэн эрхтэй админ** (seed-ээр үүснэ) бүх хэсэгт хандаж, «Админууд» хэсгээс бусад админыг
  нэмж, хандах эрхийг (Захиалга / Үйлчилгээ ба ажлын зураг / Тохиргоо) тохируулна.
- **Захиалга**: утас, дугаараар хайх, төлөвөөр шүүх, төлөв ба дотоод тэмдэглэл.
- **Үйлчилгээ**: нэр, тайлбар, нэгж, үнэ (хоосон = «Үнэ тохирно»), зураг, дараалал, нуух.
  Захиалгад ашиглагдсан үйлчилгээг устгахгүй — нууна.
- **Ажлын үр дүн**: өмнөх/дараах хос зураг.
- **Тохиргоо**: утас, ажлын цаг, үйлчлэх бүс, нүүрний зураг.

Зургийг Sharp-аар WebP болгож `UPLOAD_DIR`-д хадгална (Railway дээр Volume).

## Railway-д нийтлэх

Нэг project-д 2 service: **app** (энэ repo) ба **PostgreSQL**. Тохиргоо `railway.json`-д:
build — `npm run build`, start — `prisma migrate deploy && prisma db seed && next start`, healthcheck — `/api/health`.

1. Railway → **New Project** → **Deploy from GitHub repo** → энэ repo.
2. Project-д **Database → PostgreSQL** нэмнэ.
3. app service → **Volumes** → mount path `/data` (зураг deploy бүрт арилахгүй).
4. app service → **Variables**:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `UPLOAD_DIR` = `/data/uploads`
   - `VERIFYMN_API_KEY` — verify.mn Developer Console-оос (хоосон бол баталгаажуулалт ажиллахгүй)
   - `SEED_OWNER_EMAIL`, `SEED_OWNER_PASSWORD`, `SEED_OWNER_NAME` — эхний админ
5. Deploy хийгдэх бүрт `prisma migrate deploy` ба seed ажиллана. Seed нь зөвхөн анх удаа
   холбоо барих мэдээлэл, эхний 4 үйлчилгээ, бүрэн эрхтэй админыг (`SEED_OWNER_*`-ээр) үүсгэнэ.
   Админ нэвтэрсний дараа `SEED_OWNER_PASSWORD`-ийг Variables-аас устгана.
6. **Settings → Networking → Custom Domain**: домэйнээ нэмж, DNS-д заасан CNAME бичлэгийг
   оруулна. HTTPS сертификатыг Railway автоматаар олгоно.

### Нөөцлөлт

- **PostgreSQL**: Railway-ийн Postgres service → **Backups** (төлөвлөгөөнөөс хамаарна) эсвэл
  локалаас тогтмол `pg_dump "$DATABASE_URL" > tsembii-YYYYMMDD.sql`.
- **Зураг**: Volume-ийн `/data/uploads` хавтас; service-ийн Shell-ээс архивлан татаж авна.

## Шалгалт

```sh
npm run lint && npm run format:check && npm run typecheck && npm test && npm run build
```
