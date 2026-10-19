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

## Шалгалт

```sh
npm run lint && npm run format:check && npm run typecheck && npm test && npm run build
```
