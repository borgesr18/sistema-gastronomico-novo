# Sistema de Controle - Fichas Técnicas

Sistema completo para gestão de produtos, fichas técnicas e relatórios para estabelecimentos gastronômicos.

## Funcionalidades

- **Cadastro de Produtos/Insumos**: Gerenciamento de insumos com informações nutricionais
- **Fichas Técnicas**: Criação e gestão de receitas com cálculos automáticos de custos
- **Impressão de Fichas**: Gere uma versão pronta para imprimir das fichas técnicas
- **Autenticação de Usuários**: Acesso ao sistema mediante login e senha
- **Controle de Usuários**: Gerencie contas na seção de configurações
- **Alteração de Senhas**: Atualize as senhas dos usuários a qualquer momento
- **Controle de Estoque**: Registre compras de produtos e mantenha histórico
- **Saídas de Estoque**: Lance baixas de produtos diretamente pelo estoque
- **Categorias Personalizadas**: Cadastre e edite categorias de produtos nas configurações
- **Relatório de Estoque**: Consulte o balanço completo de itens armazenados
- **Relatórios e Dashboard**: Visualizações e métricas para tomada de decisão
- **Interface Responsiva**: Acesso em qualquer dispositivo

## Tecnologias

- Next.js 14.1.0
- React 18.2.0
- TypeScript
- Tailwind CSS

## Instruções para Deploy no Vercel

### Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Repositório GitHub com o código do projeto

### Passos para Deploy

1. **Faça login no Vercel**:
   - Acesse [vercel.com](https://vercel.com) e faça login com sua conta
   - Você pode usar sua conta GitHub para login

2. **Importe o projeto**:
   - Clique em "Add New..."
   - Selecione "Project"
   - Conecte sua conta GitHub se ainda não estiver conectada
   - Selecione o repositório do Sistema de Controle - Fichas Técnicas

3. **Configure o projeto**:
   - O Vercel detectará automaticamente que é um projeto Next.js
   - Mantenha as configurações padrão:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `npm run build`
     - Output Directory: .next
   - Não é necessário configurar variáveis de ambiente para esta versão

4. **Deploy**:
   - Clique em "Deploy"
   - O Vercel iniciará o processo de build e deploy

5. **Acesse o sistema**:
   - Após a conclusão do deploy, o Vercel fornecerá um URL para acessar o sistema
   - Por padrão, será algo como `sistema-gastronomico.vercel.app`

### Configurações Adicionais (Opcionais)

- **Domínio Personalizado**:
  - No dashboard do projeto no Vercel, vá para "Settings" > "Domains"
  - Adicione seu domínio personalizado e siga as instruções

- **Proteção com Senha**:
  - Para adicionar uma camada básica de proteção, vá para "Settings" > "Password Protection"
  - Ative a proteção e defina uma senha

## Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Iniciar servidor de produção
npm start
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para ver o sistema em funcionamento.

## Estrutura do Projeto

- `/src/app`: Páginas e rotas da aplicação
- `/src/components`: Componentes reutilizáveis
- `/src/lib`: Serviços e lógica de negócios
- `/src/utils`: Funções utilitárias

## Manutenção

Para atualizar o sistema após o deploy:
1. Faça as alterações no código
2. Envie para o repositório GitHub
3. O Vercel detectará automaticamente as mudanças e fará um novo deploy
