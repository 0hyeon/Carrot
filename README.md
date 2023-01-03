# Carrot Market

세팅환경 : Nextjs 12.1.2, react 17, TypeScript, 
ORM : prisma, 
이미지DB : cloudFlare Image
DB : planetscale, 
캐싱관리 : SWR
외부라이브러리 : Twillo, IronSession, nuka-carousel
배포 : vercel
# 배포
https://carrot-kts4eutk8-0hyeon.vercel.app/

# 모바일 메시지 토큰인증 로그인

<p align="center">
<img src="https://user-images.githubusercontent.com/65083089/205952139-1a8cfdca-3a06-4177-b9e6-303c896dda05.gif">
</p>

# 동네생활 (궁금해요+1 토글기능, 댓글추가기능)
/api/posts => create{...data} [SSG+ISR]
<p align="center">
<img src="https://user-images.githubusercontent.com/65083089/205952193-fc2e7f2c-b97a-44c8-a73f-4c38e1fc982a.gif">
</p>

# 상품업로드 (업로드사진캐러샐, 비슷한상품추천)
/api/products => create{...data}
<p align="center">
<img src="https://user-images.githubusercontent.com/65083089/205952212-8a623f6e-2876-454c-a31a-dabfffd2a532.gif">
</p>

# 그외 검색기능,pc&모바일반응형,찜하기기능
검색api : pages/api/search
반응형 : tailwind.css
찜하기api : /api/products/${router.query.id}/fav

# 아쉬운점,좋았던점
아쉬운점 : cloudFlare workers를 통해만든 웹소켓io를 배포시켜 실시간대화를 연동하지 못하였다. (차후+feat예정)
좋았던점 : 과거 쇼핑몰서비스를 운영할때 경험을바탕으로볼때  aws에서 백엔드,프론트,디비 각각 빌려서 ec2 + rds + s3 서버비용이 (주관적으로)천문학적인비용을 감안했을때, 24시간 ec2에서 서버를 대여하지 않아도 되는 서버비용절감이 가장 좋았다. 
그외 SSG+ISR을 활용한 랜더링방식 간편한 배포 Next.js + Vercel 조합, 그리고 mysql workbench 설치없이 DB를 연결하는 방식의 pscale connect, prisma studio 방식이 기존 사용하던 몽고db, mysqlDB 보다 CLI측면에서의 사용자경험이 월등히 뛰어났음.
