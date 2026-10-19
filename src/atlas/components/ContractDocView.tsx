import React from 'react';
import { BookOpen, Shield, Layers, Network, CheckCircle2, FileCode } from 'lucide-react';

export const ContractDocView: React.FC = () => {
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-10 text-slate-300">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1 uppercase tracking-wider">
          <BookOpen className="w-4 h-4" />
          Архитектурный контракт и спецификация (Deliverable 1 & 2)
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-100">
          Atlas инженерных паттернов (atlas-engineering-patterns)
        </h1>
        <p className="text-sm text-slate-400 mt-2">
          Каноническая база знаний и механизм композиции интерфейсов учебных, исследовательских и лабораторных стендов.
        </p>
      </div>

      {/* 1. Mission Statement */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-3">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          1. Миссия проекта (Mission Statement)
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          Создание структурированного, непрерывно пополняемого и повторно используемого репозитория знаний для проектирования и конфигурации интерфейсов учебных, исследовательских и лабораторных стендов. Система обеспечивает человеку или AI-агенту детерминированный подбор конструктивных примитивов, паттернов интерфейса и совместимых конфигураций под конкретную задачу стенда без галлюцинаций и с полной проверяемостью доказательной базы.
        </p>
      </section>

      {/* 2. Strict Scope Boundary */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-100">
          2. Строгие границы предметной области (Scope & Non-Goals)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded">
            <span className="font-semibold text-emerald-400 text-sm block mb-2">
              ✓ В предметной области (In Scope):
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-300 leading-relaxed">
              <li>Компоновка интерфейса и организация рабочего пространства стенда;</li>
              <li>Интерфейсные компоненты и конструктивные примитивы (шкалы, осциллографические полосы, регуляторы);</li>
              <li>Представление измерений, мнемосхем, графиков и физических состояний экспериментов;</li>
              <li>Паттерны взаимодействия, органы управления и ввод уставок;</li>
              <li>Обратная связь, протоколы наведения и защита от ошибок оператора;</li>
              <li>Адаптация под квалификацию: школьники, студенты, ученые, сертифицированные операторы;</li>
              <li>Конфигурация экранов, окон, вспомогательных touch-панелей и физической периферии;</li>
              <li>Совместимость, ограничения и эмпирические подтверждения решений.</li>
            </ul>
          </div>

          <div className="p-4 bg-rose-950/20 border border-rose-900/40 rounded">
            <span className="font-semibold text-rose-400 text-sm block mb-2">
              ✖ За пределами предметной области (Out of Scope / Non-Goals):
            </span>
            <ul className="list-disc pl-4 space-y-1.5 text-slate-300 leading-relaxed">
              <li>Общие базы инженерных знаний без привязки к интерфейсам стендов;</li>
              <li>Движки математического или физического моделирования;</li>
              <li>Схемотехника и проектирование электронных плат (PCB);</li>
              <li>Общие архитектуры AI-агентов;</li>
              <li>Универсальные программные паттерны (GoF, MVC), не специфичные для стендов;</li>
              <li>Административно-хозяйственные системы управления лабораторией;</li>
              <li>Электронная коммерция, блокчейн, социальные сети и сторонние сервисы.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Five Distinct Entity Types */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          3. Пять канонических типов сущностей
        </h2>
        <p className="text-xs text-slate-400">
          Ключевой архитектурный принцип: отделение повторно используемых строительных блоков от готовых конфигураций, собираемых из них.
        </p>

        <div className="space-y-3 text-xs">
          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <span className="font-mono text-cyan-400 font-bold mr-2">1. primitives/ (Конструктивные примитивы):</span>
            <span className="text-slate-300">
              Самостоятельно повторно используемые интерфейсные механизмы или элементы визуализации/ввода (например, <code>prim-time-series-strip</code>, <code>prim-calibrated-gauge-dial</code>, <code>prim-emergency-estop-banner</code>, <code>prim-stepper-scrubber</code>).
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <span className="font-mono text-emerald-400 font-bold mr-2">2. patterns/ (Интерфейсные паттерны):</span>
            <span className="text-slate-300">
              Повторно используемые решения повторяющихся проблем проектирования интерфейсов стендов (например, <code>pat-calibrated-telemetry-console</code>, <code>pat-guided-student-experiment-stepper</code>, <code>pat-dual-operator-safety-interlock</code>). Включают формулировку проблемы, решение и компромиссы (trade-offs).
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <span className="font-mono text-amber-400 font-bold mr-2">3. configurations/ (Конфигурации интерфейсов):</span>
            <span className="text-slate-300">
              Совместимые комбинации примитивов и паттернов, отобранные под конкретный тип физического стенда и сценарий (например, <code>cfg-aerodynamics-wind-tunnel-edustand</code>). Ссылаются на канонические записи без дублирования кода.
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <span className="font-mono text-violet-400 font-bold mr-2">4. implementations/ (Реализации):</span>
            <span className="text-slate-300">
              Конкретные примеры применения конфигураций в целевом стеке (React/Canvas, Qt/C++, QML) на физическом стендовом оборудовании (например, <code>impl-aerolab-v2-web-console</code>).
            </span>
          </div>

          <div className="p-3 bg-slate-950/60 rounded border border-slate-800">
            <span className="font-mono text-rose-400 font-bold mr-2">5. evidence/ (Свидетельства и доказательства):</span>
            <span className="text-slate-300">
              Источники, протоколы испытаний, эргономические измерения, логи отказов и стандарты, подтверждающие состоятельность решений (например, <code>evid-iso-9241-ergonomics-study-2023</code>).
            </span>
          </div>
        </div>
      </section>

      {/* 4. Relationship Ontology */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Network className="w-5 h-5 text-cyan-400" />
          4. Словарь отношений графа знаний (Relationship Vocabulary)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-cyan-400 font-bold">USES</span>
            <p className="text-slate-400 mt-1 font-sans">
              Источник использует цель как составную часть (Конфигурация → Паттерн, Паттерн → Примитив).
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-emerald-400 font-bold">COMPOSES_WITH</span>
            <p className="text-slate-400 mt-1 font-sans">
              Симметричная гармоничная компоновка в смежных зонах рабочего экрана.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-amber-400 font-bold">REQUIRES</span>
            <p className="text-slate-400 mt-1 font-sans">
              Обязательное жесткое требование к физическому экрану, сенсору или периферии.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-purple-400 font-bold">ALTERNATIVE_TO</span>
            <p className="text-slate-400 mt-1 font-sans">
              Взаимозаменяемое проектное решение с отличными инженерными компромиссами.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-indigo-400 font-bold">SPECIALIZES</span>
            <p className="text-slate-400 mt-1 font-sans">
              Специализированная или узко-доменная модификация базового паттерна.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-rose-400 font-bold">CONFLICTS_WITH</span>
            <p className="text-slate-400 mt-1 font-sans">
              Взаимная несовместимость или опасность совместного применения компонентов.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-violet-400 font-bold">IMPLEMENTED_IN</span>
            <p className="text-slate-400 mt-1 font-sans">
              Ссылка на проверяемый программно-аппаратный код реализации на реальном стенде.
            </p>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="text-pink-400 font-bold">VERIFIED_BY</span>
            <p className="text-slate-400 mt-1 font-sans">
              Прямая ссылка на эргономическое исследование, испытания или стандарт безопасности.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Ingestion Workflow & Acceptance Invariants */}
      <section className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          5. Инварианты приёмки и честности (Anti-Hallucination)
        </h2>
        <ul className="list-disc pl-5 space-y-2 text-xs text-slate-300 leading-relaxed">
          <li>
            <strong className="text-slate-100">Отсутствие вымышленных сущностей:</strong> Если по запросу стенда отсутствует подходящий паттерн, подсистема поиска обязана зафиксировать <em>пробел в знаниях (Knowledge Gap)</em>, а не фабриковать несуществующие элементы.
          </li>
          <li>
            <strong className="text-slate-100">Приоритет жестких ограничений над релевантностью:</strong> Кандидат исключается из итоговой сборки при нарушении жестких условий (например, недопустимость опасных незаблокированных режимов для школьников или нехватка мониторов).
          </li>
          <li>
            <strong className="text-slate-100">Жизненный цикл зрелости:</strong> Каждая сущность имеет явный статус: <code>PROPOSED</code> → <code>SPECIFIED</code> → <code>IMPLEMENTED</code> → <code>TESTED</code> → <code>INDEPENDENTLY_VERIFIED</code> → <code>MEASURED</code> → <code>DEPRECATED</code>.
          </li>
          <li>
            <strong className="text-slate-100">Непрерывная расширяемость:</strong> Добавление новых сущностей через конвейер Ingestion не требует изменения существующей таксономии и иерархии репозитория.
          </li>
        </ul>
      </section>
    </div>
  );
};
