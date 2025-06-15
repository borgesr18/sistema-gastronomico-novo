const login = async (email: string, senha: string) => {
  setErro(null);
  setLoading(true);

  try {
    const resposta = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const resultado = await resposta.json();

    if (resultado.sucesso) {
      setUsuarioAtual(resultado.usuario);
      localStorage.setItem('usuarioLogado', resultado.usuario.id);
      return resultado.usuario;
    } else {
      setErro(resultado.mensagem || 'Credenciais inválidas');
      return null;
    }
  } catch (error) {
    console.error('Erro na requisição de login:', error);
    setErro('Erro na conexão com o servidor');
    return null;
  } finally {
    setLoading(false);
  }
};
