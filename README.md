# tradesim212-denislav
React + Spring Boot + PostgreSQL Crypto Trading Simulator

How to run:
1. git clone https://github.com/DenkoBetona/tradesim212-denislav
2. Go to tradesim212-denislav/tradebackend/src/main/resources
3. Edit application.properties according to your PostgreSQL database (datasource.name, url, username, password)
4. Execute all SQL statements in schema.sql to your Postgres database
5. cd tradebackend
6. ./mvnw spring-boot:run (this runs the backend on localhost:8080)
7. cd ../tradefrontend
8. npm install (this installs all dependencies needed)
9. npm run dev (this runs the frontend on localhost:5173)
10. Open http://localhost:5173/ and enjoy!

Screenshot of the initial application screen displaying the top 20 cryptocurrency prices:

![initial](https://github.com/user-attachments/assets/d72f411e-d665-446b-b3cc-8a012bac5d1d)

Screenshot of the user interface for buying and selling cryptocurrencies:

![buysell](https://github.com/user-attachments/assets/fccf35e6-ac92-45cc-a94b-ce0304931090)

Screenshot showing the updated account balance after a couple of transaction:

![transactions](https://github.com/user-attachments/assets/3928704a-cbd4-4748-8c31-e7b6e929ead8)

Screen recording demonstrating a user journey through the main functionalities of the platform:

[tradevid.webm](https://github.com/user-attachments/assets/e83450c6-c337-416b-b021-2c58e6c3c05a)
