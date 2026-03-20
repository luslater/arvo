import { Resend } from "resend"

const FROM_EMAIL = "ARVO <noreply@meuarvo.com.br>"
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || "contato@meuarvo.com.br"
const BASE_URL = process.env.NEXTAUTH_URL || "https://www.meuarvo.com.br"

export async function sendNewUserNotification({
    name,
    email,
    registeredAt,
}: {
    name: string | null
    email: string
    registeredAt: Date
}) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const approvalUrl = `${BASE_URL}/admin/users`

    const dateStr = registeredAt.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })

    await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🔔 Novo cadastro ARVO — ${name || email}`,
        html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#F4F6F9; font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:24px; overflow:hidden; border:1px solid rgba(10,25,47,0.08);">
          
          <!-- Header azul -->
          <tr>
            <td style="background:#0A192F; padding:32px 40px;">
              <p style="margin:0; color:#ffffff; font-size:22px; font-weight:700; letter-spacing:-0.5px;">ARVO</p>
              <p style="margin:4px 0 0; color:rgba(255,255,255,0.5); font-size:12px; letter-spacing:0.08em; text-transform:uppercase;">Painel Administrativo</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 6px; font-size:13px; color:#94A3B8; text-transform:uppercase; font-weight:700; letter-spacing:0.08em;">Novo cadastro recebido</p>
              <h1 style="margin:0 0 24px; font-size:24px; font-weight:700; color:#0A192F; line-height:1.3;">
                ${name || "Usuário sem nome"} solicitou acesso
              </h1>

              <!-- Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F6F9; border-radius:16px; margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0; border-bottom:1px solid rgba(10,25,47,0.06);">
                          <span style="font-size:12px; color:#94A3B8;">Nome</span><br/>
                          <span style="font-size:14px; font-weight:600; color:#0A192F;">${name || "—"}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; border-bottom:1px solid rgba(10,25,47,0.06);">
                          <span style="font-size:12px; color:#94A3B8;">E-mail</span><br/>
                          <span style="font-size:14px; font-weight:600; color:#0A192F;">${email}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="font-size:12px; color:#94A3B8;">Data do cadastro</span><br/>
                          <span style="font-size:14px; font-weight:600; color:#0A192F;">${dateStr}</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${approvalUrl}"
                       style="display:inline-block; background:#0A192F; color:#ffffff; text-decoration:none; font-size:14px; font-weight:700; padding:14px 32px; border-radius:12px; letter-spacing:0.02em;">
                      ✅ Revisar e aprovar cadastro
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0; font-size:11px; color:#CBD5E0; text-align:center;">
                Acesse também em: <a href="${approvalUrl}" style="color:#94A3B8;">${approvalUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px; border-top:1px solid rgba(10,25,47,0.06); text-align:center;">
              <p style="margin:0; font-size:11px; color:#CBD5E0;">
                ARVO · meuarvo.com.br · Este e-mail é enviado apenas para administradores da plataforma.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
        `.trim(),
    })
}
