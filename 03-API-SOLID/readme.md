# APP

Gympass style app.

## RF ( O que a aplicação precisa fazer)

- [x] Deve ser possivel se cadastrar
- [ ] Deve ser possível se autenticar
- [ ] Deve ser possível obter o perfil de um usuário logado
- [ ] Deve ser possível obter o numero de check-ins realizados pelo usuário logado
- [ ] Deve ser possível o usuário buscar academias proximas
- [ ] Deve ser possível o usuário buscar academias pelo nome
- [ ] Deve ser possível o usuário realizar check-in em uma academia
- [ ] Deve ser possível validar o check-in
- [ ] Deve ser possível cadastrar uma academia

## RN (Como a aplicação precisa fazer)

- [ ] O usuário não deve poder ser cadastrar com um e-mail duplicado
- [ ] O usuário não pode fazer 2 check-ins no mesmo dia
- [ ] O usuário não pode fazer chekin se não estiver (180k) da academia;
- [ ] O checkin pode ser validado até 20 minutos após criado
- [ ] O checkin só pode ser validado por administradores
- [ ] A academia só pode ser cadastrada por adminstradores

## RNF (Requisitos que não dependem da vontade do cliente(tecnologias utilizas por exemplo))

- [ ] A senha do usuário precisa estár criptgrafada
- [ ] Os dados da aplicação precisam estar persistidos em um banco postreSQL;
- [ ] Todas as listas de dados precisam estar paginadas com 20 items por paginas
- [ ] O usuário deve ser identificado por um JWT
