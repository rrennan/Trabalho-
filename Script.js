let usuariosCadastrados = JSON.parse(localStorage.getItem("usuariosCadastrados")) || [
  { email: "user@lifemed.com", senha: "123", nome: "LifeMed user" }
];

function toggleAuthMode(isRegistering) {
  const signInForm = document.getElementById("signInForm");
  const signUpForm = document.getElementById("signUpForm");
  
  document.getElementById("authLoginError").innerText = "";
  document.getElementById("authRegisterError").innerText = "";

  if (isRegistering) {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
  } else {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
  }
}

function fazerLogin() {
  const emailInput = document.getElementById("loginEmail").value.trim();
  const senhaInput = document.getElementById("loginSenha").value;
  const errorElement = document.getElementById("authLoginError");

  errorElement.innerText = "";

  if (!emailInput || !senhaInput) {
    errorElement.innerText = "Por favor, preencha todos os campos.";
    return;
  }

  const usuarioValido = usuariosCadastrados.find(
    u => u.email.toLowerCase() === emailInput.toLowerCase() && u.senha === senhaInput
  );

  if (usuarioValido) {
    // Injeta os dados do usuário logado diretamente nos campos do seu HTML
    document.querySelector(".user-name").innerText = usuarioValido.nome;
    document.getElementById("patientName").value = usuarioValido.nome;
    document.getElementById("patientEmail").value = usuarioValido.email;

    // Esconde a tela de login e mostra o sistema
    document.getElementById("authScreen").style.display = "none";
    document.getElementById("mainSystem").style.display = "block";
    document.getElementById("sidebar").style.display = "flex";
  } else {
    errorElement.innerText = "E-mail ou senha incorretos.";
  }
}

function fazerCadastro() {
  const nome = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const senha = document.getElementById("registerSenha").value;
  const errorElement = document.getElementById("authRegisterError");

  errorElement.innerText = "";

  if (!nome || !email || !senha) {
    errorElement.innerText = "Por favor, preencha todos os campos.";
    return;
  }

  const emailExiste = usuariosCadastrados.some(u => u.email.toLowerCase() === email.toLowerCase());
  if (emailExiste) {
    errorElement.innerText = "Este e-mail já está cadastrado.";
    return;
  }

  // Adiciona no array temporário
  usuariosCadastrados.push({ nome, email, senha });
  
  // ATUALIZA O BANCO DE DADOS (Grava permanentemente no navegador)
  localStorage.setItem("usuariosCadastrados", JSON.stringify(usuariosCadastrados));
  
  // Volta para a tela de login com mensagem de sucesso
  toggleAuthMode(false);
  document.getElementById("authLoginError").style.color = "var(--teal-400)";
  document.getElementById("authLoginError").innerText = "Conta criada! Faça seu login.";
  
  setTimeout(() => {
    document.getElementById("authLoginError").style.color = "";
  }, 4000);
}

let etapaAtual = 1;

function goStep(step) {
  // 1. Limpa as mensagens de erro antigas
  document.getElementById("nameError").innerText = "";
  document.getElementById("emailError").innerText = "";
  document.getElementById("phoneError").innerText = "";
  document.getElementById("cpfError").innerText = "";
  document.getElementById("dobError").innerText = "";

  // 2. Validações de campos
  if (step === 2) {
    const nome = document.getElementById("patientName").value;
    const email = document.getElementById("patientEmail").value;
    const phone = document.getElementById("patientPhone").value;
    const cpf = document.getElementById("patientCPF").value;
    const dob = document.getElementById("patientDOB").value;
    let possuiErro = false;
    if (!nome) { document.getElementById("nameError").innerText = "Preencha o nome"; possuiErro = true; }
    if (!email) { document.getElementById("emailError").innerText = "Preencha o e-mail"; possuiErro = true; }
    if (!phone) { document.getElementById("phoneError").innerText = "Preencha o telefone"; possuiErro = true; }
    if (!cpf) { document.getElementById("cpfError").innerText = "Preencha o CPF"; possuiErro = true; }
    if (!dob) { document.getElementById("dobError").innerText = "Preencha a data de nascimento"; possuiErro = true; }
    if (possuiErro) return;
  }
  if (step === 3) {
    const doctor = document.getElementById("doctor").value;
    let possuiErro = false;
    if (!doctor) { document.getElementById("doctorError").innerText = "Selecione um médico"; possuiErro = true; }
    if (possuiErro) return;
  }
  if (step === 4) {
    const consultTime = document.getElementById("consultTime").value;
    const consultDate = document.getElementById("consultDate").value;
    const notes = document.getElementById("notes").value;
    let possuiErro = false;
    if (!consultDate) { document.getElementById("dateError").innerText = "Selecione a data da consulta"; possuiErro = true; }
    if (!consultTime) { document.getElementById("timeError").innerText = "Selecione o horário"; possuiErro = true; }
    if (possuiErro) return;
  }

  etapaAtual = step;

  // 3. Controla os passos do formulário
  document.getElementById("step1").style.display = "none";
  document.getElementById("step2").style.display = "none";
  document.getElementById("step3").style.display = "none";
  document.getElementById("step4").style.display = "none";

  // GARANTE que a mensagem de sucesso comece sumida enquanto navega nos passos
  document.getElementById("successMsg").style.display = "none";

  document.getElementById(`step${step}`).style.display = "block";

  // 4. Atualiza as bolinhas do topo
  const todosPassos = document.querySelectorAll(".steps .step");
  todosPassos.forEach((elementoPasso) => {
    const numeroPasso = parseInt(elementoPasso.getAttribute("data-step"));
    elementoPasso.classList.remove("active", "done");
    if (numeroPasso === step) {
      elementoPasso.classList.add("active");
    } else if (numeroPasso < step) {
      elementoPasso.classList.add("done");
    }
  });

  // 5. Atualiza a revisão do Passo 4
  const patientName = document.getElementById("patientName").value;
  const patientPhone = document.getElementById("patientPhone").value;
  const patientEmail = document.getElementById("patientEmail").value;
  const patientCPF = document.getElementById("patientCPF").value;
  const doctor = document.getElementById("doctor").value;
  const consultDate = document.getElementById("consultDate").value;
  const consultTime = document.getElementById("consultTime").value;
  const consultTypeInput = document.querySelector('input[name="consultType"]:checked');
  const consultType = consultTypeInput ? consultTypeInput.value : "Presencial";
  const specialtySelecionada = document.querySelector('input[name="specialty"]:checked');
  let specialty = "Não selecionada";
  if (specialtySelecionada) {
    specialty = specialtySelecionada.parentElement.innerText.trim();
  }

  document.getElementById("rev-name").innerText = patientName;
  document.getElementById("rev-phone").innerText = patientPhone;
  document.getElementById("rev-email").innerText = patientEmail;
  document.getElementById("rev-cpf").innerText = patientCPF;
  document.getElementById("rev-specialty").innerText = specialty;
  document.getElementById("rev-doctor").innerText = doctor;
  document.getElementById("rev-type").innerText = consultType;
  document.getElementById("rev-date").innerText = consultDate;
  document.getElementById("rev-time").innerText = consultTime;
}

function finalizarAgendamento() {
  // Esconde o formulário completamente
  document.getElementById("appointmentForm").style.display = "none";
  
  // MOSTRA a mensagem restaurando o layout padrão do CSS (centralizado)
  document.getElementById("successMsg").style.display = "";
}

function resetForm() {
  document.getElementById("appointmentForm").reset();
  
  // Esconde a tela de sucesso
  document.getElementById("successMsg").style.display = "none";
  
  // Mostra o formulário novamente
  document.getElementById("appointmentForm").style.display = "block";
  
  const usuarioLogadoNome = document.querySelector(".user-name").innerText;
  const usuarioLogadoEmail = document.getElementById("patientEmail").value; 
  if(usuarioLogadoNome !== "Paciente") {
      document.getElementById("patientName").value = usuarioLogadoNome;
      document.getElementById("patientEmail").value = usuarioLogadoEmail;
  }
  
  goStep(1);
}

function mascaraTelefone(input) {
  let valor = input.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  
  if (valor.length > 7) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2, 7)}-${valor.slice(7)}`;
  } else if (valor.length > 2) {
    input.value = `(${valor.slice(0, 2)}) ${valor.slice(2)}`;
  } else if (valor.length > 0) {
    input.value = `(${valor}`;
  } else {
    input.value = "";
  }
}

function mascaraCPF(input) {
  let valor = input.value.replace(/\D/g, "");
  if (valor.length > 11) valor = valor.slice(0, 11);
  
  if (valor.length > 9) {
    input.value = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6, 9)}-${valor.slice(9)}`;
  } else if (valor.length > 6) {
    input.value = `${valor.slice(0, 3)}.${valor.slice(3, 6)}.${valor.slice(6)}`;
  } else if (valor.length > 3) {
    input.value = `${valor.slice(0, 3)}.${valor.slice(3)}`;
  } else if (valor.length > 0) {
    input.value = `${valor}`;
  } else {
    input.value = "";
  }
}
