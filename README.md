# 김정훈 포트폴리오 · GitHub Pages용 정적 파일

현재 운영 중인 포트폴리오의 **브라우저에 표시된 화면**을 HTML/CSS/이미지로 옮긴 버전입니다. 원래 개발 저장소의 React/Next 소스나 비밀번호 기능을 복원한 것은 아닙니다. 홈페이지와 프로젝트 상세 7개 페이지를 포함합니다.

## 파일 구조

```text
portfolio-github/
├─ index.html                    # 홈: 소개, 프로젝트, 역량, AI 자동화, 이력, 자격·수상, 연락처
├─ assets/
│  ├─ style.css                  # 현재 사이트에서 사용 중인 스타일 + 정적 배포 보정
│  ├─ site.js                    # 스크롤 표시와 등장 효과
│  ├─ jeonghun-portrait.webp    # 프로필 이미지
│  └─ data-analysis-award.webp  # 데이터 분석 경진대회 상장 이미지
└─ projects/
   ├─ localhub/index.html
   ├─ rolling-data/index.html
   ├─ battery-thermal/index.html
   ├─ unist-studio/index.html
   ├─ auto-stop/index.html
   ├─ energy-harvesting/index.html
   └─ ai-workflow/index.html
```

## GitHub Pages에 게시하기

1. GitHub에 새 저장소를 만듭니다. 주소를 `사용자명.github.io`로 하고 싶다면 저장소 이름도 정확히 `사용자명.github.io`로 지정합니다.
2. 이 폴더의 **내용물**(`index.html`, `assets/`, `projects/`)을 저장소 최상위에 업로드합니다.
3. 저장소의 **Settings → Pages → Build and deployment**에서 **Deploy from a branch**, `main`, `/(root)`를 선택합니다.
4. 게시가 완료되면 `https://사용자명.github.io/` 또는 `https://사용자명.github.io/저장소명/`으로 접속합니다.

프로젝트 내부 링크는 상대경로이므로 두 주소 형태에서 모두 작동하도록 구성했습니다.

**공개 전 확인:** 현재 화면의 이메일·전화번호가 파일에 포함되어 있습니다. GitHub 공개 저장소와 GitHub Pages에 게시하면 누구나 볼 수 있으므로 원치 않으면 먼저 수정하세요. 현재 운영 사이트의 비밀번호 입장 기능은 이 정적 버전에 포함되지 않습니다.

## 현재 사이트의 기술 구조

운영 사이트에서 확인한 파일은 Next 형식의 모듈 스크립트, 하나의 CSS 묶음, 프로필 이미지입니다. 이 자료만으로 원본 프로젝트의 컴포넌트 파일 구성이나 서버 측 비밀번호 구현을 정확히 알 수는 없습니다. 이 폴더는 GitHub Pages에서 실행할 수 있도록 화면 결과를 정적으로 옮긴 것입니다.
