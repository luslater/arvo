import { Resend } from "resend"

const FROM_EMAIL = "ARVO <noreply@meuarvo.com.br>"
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "contato@meuarvo.com.br"
const BASE_URL = process.env.NEXTAUTH_URL || "https://www.meuarvo.com.br"

// ─── Utilitário interno ────────────────────────────────────────────────────────
function emailShell(headerTitle: string, headerSubtitle: string, headerBg: string, body: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#F4F6F9;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;border:1px solid rgba(10,25,47,0.08);">
        <tr>
          <td style="background:${headerBg};padding:28px 40px;">
            <p style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">ARVO</p>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.55);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">${headerTitle}</p>
          </td>
        </tr>
        <tr><td style="padding:36px 40px;">${body}</td></tr>
        <tr>
          <td style="padding:20px 40px;border-top:1px solid rgba(10,25,47,0.06);text-align:center;">
            <p style="margin:0;font-size:11px;color:#CBD5E0;">ARVO · meuarvo.com.br</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}

function infoRow(label: string, value: string, last = false) {
  const border = last ? "" : "border-bottom:1px solid rgba(10,25,47,0.06);"
  return `<tr><td style="padding:8px 0;${border}">
      <span style="font-size:12px;color:#94A3B8;">${label}</span><br/>
      <span style="font-size:14px;font-weight:600;color:#0A192F;">${value || "—"}</span>
    </td></tr>`
}

function ctaButton(href: string, label: string, bg = "#0A192F") {
  return `<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
      <a href="${href}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;letter-spacing:0.02em;">${label}</a>
    </td></tr></table>`
}

// ─── 1. Notificação ao ADMIN ────────────────────────────────────────────────────
export async function sendNewUserNotification({
  name, email, cpf, phone, registeredAt,
}: {
  name: string | null; email: string; cpf?: string | null; phone?: string | null; registeredAt: Date
}) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const approvalUrl = `${BASE_URL}/admin/users`
  const dateStr = registeredAt.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })

  const body = `
      <p style="margin:0 0 6px;font-size:13px;color:#94A3B8;text-transform:uppercase;font-weight:700;letter-spacing:0.08em;">Novo cadastro recebido</p>
      <h1 style="margin:0 0 24px;font-size:24px;font-weight:700;color:#0A192F;line-height:1.3;">${name || "Usuário"} solicitou acesso</h1>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;border-radius:16px;margin-bottom:28px;">
        <tr><td style="padding:20px 24px;"><table width="100%" cellpadding="0" cellspacing="0">
          ${infoRow("Nome", name || "")}
          ${infoRow("E-mail", email)}
          ${infoRow("CPF", cpf || "Não informado")}
          ${infoRow("Celular", phone || "Não informado")}
          ${infoRow("Data do cadastro", dateStr, true)}
        </table></td></tr>
      </table>
      ${ctaButton(approvalUrl, "✅ Revisar e aprovar cadastro")}
      <p style="margin:24px 0 0;font-size:11px;color:#CBD5E0;text-align:center;">Acesse também em: <a href="${approvalUrl}" style="color:#94A3B8;">${approvalUrl}</a></p>
    `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `🔔 Novo cadastro ARVO — ${name || email}`,
    html: emailShell("Painel Administrativo", "Painel Administrativo", "#0A192F", body),
  })
}

// ─── 2. E-mail ao USUÁRIO: cadastro em análise ─────────────────────────────────
export async function sendRegistrationPendingEmail({ name, email }: { name: string | null; email: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = `
      <p style="margin:0 0 6px;font-size:13px;color:#94A3B8;text-transform:uppercase;font-weight:700;letter-spacing:0.08em;">Cadastro recebido</p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0A192F;">Olá, ${name?.split(" ")[0] || ""}! Seu cadastro está em análise.</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#4A5568;line-height:1.7;">
        Obrigado por se cadastrar na <strong style="color:#0A192F;">ARVO</strong>. Nossa equipe está avaliando seu perfil e em breve você receberá um retorno por e-mail.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9;border-radius:16px;margin-bottom:28px;padding:20px 24px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#0A192F;">O que acontece agora?</p>
          <p style="margin:0 0 6px;font-size:13px;color:#4A5568;">✅ Cadastro enviado com sucesso</p>
          <p style="margin:0 0 6px;font-size:13px;color:#4A5568;">⏳ Nossa equipe irá analisar em até 24h</p>
          <p style="margin:0;font-size:13px;color:#4A5568;">📧 Você receberá um e-mail assim que a análise for concluída</p>
        </td></tr>
      </table>
      <p style="margin:0;font-size:12px;color:#94A3B8;text-align:center;">Dúvidas? Entre em contato em <a href="mailto:contato@meuarvo.com.br" style="color:#0A192F;font-weight:600;">contato@meuarvo.com.br</a></p>
    `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "⏳ ARVO — Seu cadastro está em análise",
    html: emailShell("Cadastro em Análise", "", "#1E3A5F", body),
  })
}

// ─── 3. E-mail ao USUÁRIO: aprovado ────────────────────────────────────────────
export async function sendRegistrationApprovedEmail({ name, email }: { name: string | null; email: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const loginUrl = `${BASE_URL}/login`

  const body = `
      <p style="margin:0 0 6px;font-size:13px;color:#94A3B8;text-transform:uppercase;font-weight:700;letter-spacing:0.08em;">Acesso liberado</p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0A192F;">🎉 ${name?.split(" ")[0] || "Olá"}! Seu acesso foi aprovado.</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#4A5568;line-height:1.7;">
        Sua conta na <strong style="color:#0A192F;">ARVO</strong> foi aprovada pela nossa equipe. Agora você já pode acessar a plataforma e começar a organizar seus investimentos.
      </p>
      ${ctaButton(loginUrl, "🚀 Entrar na plataforma ARVO", "#065F46")}
      <p style="margin:24px 0 0;font-size:12px;color:#CBD5E0;text-align:center;">Acesse: <a href="${loginUrl}" style="color:#94A3B8;">${loginUrl}</a></p>
    `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "✅ ARVO — Seu acesso foi aprovado!",
    html: emailShell("Acesso Aprovado", "", "#065F46", body),
  })
}

// ─── 4. E-mail ao USUÁRIO: rejeitado ───────────────────────────────────────────
export async function sendRegistrationRejectedEmail({ name, email }: { name: string | null; email: string }) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const body = `
      <p style="margin:0 0 6px;font-size:13px;color:#94A3B8;text-transform:uppercase;font-weight:700;letter-spacing:0.08em;">Atualização do cadastro</p>
      <h1 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#0A192F;">Olá, ${name?.split(" ")[0] || ""}.</h1>
      <p style="margin:0 0 24px;font-size:15px;color:#4A5568;line-height:1.7;">
        Após análise da nossa equipe, não foi possível aprovar seu cadastro na <strong style="color:#0A192F;">ARVO</strong> neste momento. Agradecemos seu interesse.
      </p>
      <p style="margin:0 0 24px;font-size:14px;color:#4A5568;line-height:1.7;">
        Se acreditar que houve um engano ou quiser conversar sobre o seu perfil, entre em contato com nossa equipe — ficaremos felizes em ajudar.
      </p>
      ${ctaButton("mailto:contato@meuarvo.com.br", "📧 Falar com a equipe ARVO", "#0A192F")}
    `

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: "ARVO — Atualização sobre seu cadastro",
    html: emailShell("Atualização de Cadastro", "", "#0A192F", body),
  })
}
