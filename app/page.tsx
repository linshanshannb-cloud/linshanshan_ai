import { ChatSection } from "@/components/chat-section";
import { resume } from "@/data/resume";

function SectionTitle({
  eyebrow,
  children,
  description,
}: {
  eyebrow: string;
  children: React.ReactNode;
  description?: string;
}) {
  return (
    <div className="mb-8">
      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold md:text-4xl">{children}</h2>
      {description && (
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">{description}</p>
      )}
    </div>
  );
}

export default function Home() {
  const toolGroups = [
    ["产品设计", resume.tools.product],
    ["AI 工具", resume.tools.ai],
    ["数据分析", resume.tools.data],
    ["项目管理", resume.tools.management],
  ] as const;

  return (
    <main>
      <nav className="sticky top-0 z-20 border-b border-white/70 bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
          <a href="#" className="text-lg font-bold">
            {resume.name}
          </a>
          <div className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
            <a className="transition hover:text-primary" href="#capabilities">
              核心能力
            </a>
            <a className="transition hover:text-primary" href="#ai-projects">
              AI 实践
            </a>
            <a className="transition hover:text-primary" href="#experience">
              工作经历
            </a>
            <a
              className="rounded-full bg-ink px-4 py-2 font-medium text-white transition hover:bg-primary"
              href="#chat"
            >
              问 AI 分身
            </a>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <section className="grid min-h-[610px] items-start gap-12 pb-14 pt-16 md:grid-cols-[1.4fr_0.6fr] md:pb-16 md:pt-20">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              求职方向：AI 产品经理 · {resume.availability}
            </div>
            <h1 className="text-4xl font-black leading-[1.15] tracking-tight text-ink md:text-6xl">
              从 ToB 产品负责人
              <span className="mt-2 block bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                到 AI 产品经理
              </span>
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">
              7 年产品经验，聚焦 Agent、RAG 与 Workflow 产品实践。独立完成
              AI 在线简历、AI 减脂 Agent、企业 AI 客服 Agent 等项目，持续探索
              AI 产品在真实业务中的落地方式。
            </p>
            <div className="mt-11 flex flex-wrap gap-3">
              <a
                href="#ai-projects"
                className="rounded-2xl bg-primary px-6 py-3 font-semibold text-white shadow-lg shadow-primary/20 transition hover:-translate-y-0.5 hover:bg-indigo-700"
              >
                查看项目作品
              </a>
              <a
                href="#chat"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-primary hover:text-primary"
              >
                和 AI 分身聊聊
              </a>
            </div>
          </div>

          <aside className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-4 rotate-3 rounded-[2rem] bg-gradient-to-br from-primary/20 to-cyan-300/10 blur-sm" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-card backdrop-blur-xl">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute -bottom-20 -left-16 h-40 w-40 rounded-full bg-cyan-300/15 blur-3xl" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Digital Identity
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-ink">LQW Agent</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {resume.name} · {resume.title}
                    </p>
                  </div>
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-indigo-400 font-bold text-white shadow-lg shadow-primary/20">
                    AI
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400" />
                  </div>
                </div>

                <div className="mt-6 space-y-2.5 rounded-2xl border border-slate-200/70 bg-white/60 p-4 font-mono text-xs">
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">状态</span>
                    <span className="font-semibold text-emerald-600">● 在线</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">角色</span>
                    <span className="text-right font-semibold text-slate-700">
                      AI 产品经理
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-400">专注方向</span>
                    <span className="text-right font-semibold text-slate-700">
                      Agent / RAG / Workflow
                    </span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {[
                    "AI Agent",
                    "RAG",
                    "Workflow",
                    "ToB SaaS",
                    "0-1 产品",
                    "产品团队管理",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-200/70 pt-5">
                  {[
                    ["7 年", "产品经验"],
                    ["3 个", "AI 项目"],
                    ["4 人", "产品团队"],
                  ].map(([value, label]) => (
                    <div key={label} className="min-w-0">
                      <p className="text-xl font-black text-primary">{value}</p>
                      <p className="mt-1 text-[10px] leading-4 text-slate-500">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </section>

        <section id="capabilities" className="scroll-mt-24 pb-20 pt-8">
          <SectionTitle
            eyebrow="Core Strengths"
            description="以成熟的 ToB 产品基本功为底座，用真实项目验证 Agent、RAG 与工作流产品设计能力。"
          >
            核心能力
          </SectionTitle>
          <div className="grid gap-5 md:grid-cols-2">
            {resume.capabilities.map((item, index) => (
              <article
                key={item.title}
                className="rounded-3xl border border-white bg-white p-7 shadow-card"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 font-mono font-bold text-primary">
                  0{index + 1}
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="ai-projects" className="scroll-mt-24 py-20">
          <SectionTitle
            eyebrow="AI Product Practice"
            description="围绕 C 端健康陪伴与 ToB 客服两个真实场景，完成从问题定义、业务流程到 Agent Demo 的完整实践。"
          >
            AI 项目实践
          </SectionTitle>
          <div className="grid gap-6 lg:grid-cols-2">
            {resume.aiProjects.map((project) => (
              <article
                key={project.name}
                className="overflow-hidden rounded-3xl border border-white bg-white shadow-card"
              >
                <div className="border-b border-slate-100 bg-gradient-to-br from-ink to-slate-800 p-7 text-white">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200">
                      {project.type}
                    </span>
                    <span className="font-mono text-sm text-indigo-200">{project.tag}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold">{project.name}</h3>
                  <p className="mt-3 leading-7 text-slate-300">{project.background}</p>
                </div>
                <div className="space-y-6 p-7">
                  <div>
                    <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">
                      核心工作
                    </p>
                    <ul className="space-y-2 text-sm leading-7 text-slate-600">
                      {project.responsibilities.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl bg-primary/5 p-5">
                    <p className="mb-3 text-sm font-bold text-primary">项目成果</p>
                    <ul className="space-y-2 text-sm leading-7 text-slate-700">
                      {project.results.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="scroll-mt-24 py-20">
          <SectionTitle eyebrow="Experience">工作经历</SectionTitle>
          <div className="grid gap-5">
            {resume.work.map((item) => (
              <article
                key={`${item.company}-${item.role}`}
                className="grid gap-5 rounded-3xl border border-white bg-white p-6 shadow-card md:grid-cols-[180px_1fr] md:p-8"
              >
                <p className="font-mono text-sm font-semibold text-primary">{item.period}</p>
                <div>
                  <h3 className="text-xl font-bold">{item.role}</h3>
                  <p className="mt-1 font-medium text-slate-500">{item.company}</p>
                  <p className="mt-4 max-w-4xl leading-7 text-slate-600">{item.description}</p>
                  <ul className="mt-4 grid gap-2 text-sm leading-7 text-slate-600">
                    {item.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                  {item.metrics.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.metrics.map((metric) => (
                        <span
                          key={metric}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
                        >
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="scroll-mt-24 py-20">
          <SectionTitle eyebrow="Selected Products">代表项目</SectionTitle>
          <div className="grid gap-5 md:grid-cols-3">
            {resume.productProjects.map((project, index) => (
              <article
                key={project.name}
                className="rounded-3xl border border-white bg-white p-7 shadow-card transition hover:-translate-y-1"
              >
                <div className="mb-8 flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 font-bold text-primary">
                    0{index + 1}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-500">
                    {project.tag}
                  </span>
                </div>
                <h3 className="text-xl font-bold">{project.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{project.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="transition" className="scroll-mt-24 py-20">
          <div className="overflow-hidden rounded-[2rem] bg-ink p-8 text-white md:p-12">
            <SectionTitle
              eyebrow="AI Transition"
              description="不是脱离既有经验重新开始，而是将 7 年产品积累迁移到 AI 原生产品设计。"
            >
              AI 产品转型路径
            </SectionTitle>
            <div className="grid gap-4 md:grid-cols-2">
              {resume.transition.map((item, index) => (
                <div
                  key={item.label}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white">{item.label}</p>
                    <p className="mt-2 leading-7 text-slate-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <SectionTitle eyebrow="Toolkit">工具与技能</SectionTitle>
          <div className="grid gap-4 md:grid-cols-2">
            {toolGroups.map(([label, tools]) => (
              <div
                key={label}
                className="rounded-3xl border border-white bg-white p-6 shadow-card"
              >
                <p className="font-bold">{label}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {tools.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-slate-100 px-3 py-1.5 text-sm text-slate-600"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <ChatSection />

        <section className="mb-20 overflow-hidden rounded-[2rem] bg-primary p-8 text-white md:flex md:items-center md:justify-between md:p-12">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200">
              Contact
            </p>
            <h2 className="mt-2 text-3xl font-bold">期待交流 AI 产品机会</h2>
            <p className="mt-3 max-w-2xl leading-7 text-indigo-100">
              {resume.name} · {resume.experience} · {resume.availability}
            </p>
          </div>
          <div className="mt-7 space-y-2 md:mt-0 md:text-right">
            <a className="block text-lg font-semibold hover:text-indigo-200" href={`tel:${resume.phone}`}>
              {resume.phone}
            </a>
            <a className="block hover:text-indigo-200" href={`mailto:${resume.email}`}>
              {resume.email}
            </a>
          </div>
        </section>

        <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} {resume.name} · AI 产品经理在线作品集
        </footer>
      </div>
    </main>
  );
}
