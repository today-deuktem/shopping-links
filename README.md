# shopping-links

가성비 꿀템 링크 모음 — 쇼핑쇼츠용 링크인바이오(GitHub Pages 정적 페이지).

- 사이트: https://today-deuktem.github.io/shopping-links/
- 데이터: https://today-deuktem.github.io/shopping-links/products.json

## 구조

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 템플릿(헤더·번호 검색·카드 목록·제휴 고지) |
| `assets/style.css` | 스타일 |
| `assets/app.js` | 번호·상품명 검색, 카드 렌더링(`products.json` fetch) |
| `products.json` | 상품 데이터 — 파이프라인은 이 파일만 갱신 후 push |

## products.json 규격

`updated_at`, `disclosure`, `contact`, `items[]`.
각 항목: `no`, `code`(`#012`), `title`, `price`, `price_text`, `category`, `image`, `links[]`(`network`·`label`·`url`), `video_url`, `added_at`, `status`.

`no`는 재사용하지 않는 고정 번호입니다. 링크가 죽어도 번호는 유지하고 `status`만 `"check"`로 바꿉니다(영상이 이미 "#012"라고 말했기 때문).

## 배포

`main` 브랜치 `/(root)` → GitHub Pages 자동 배포. push 후 수십 초 뒤 반영되며, 직후 404는 빌드 중일 수 있습니다.

