/**
 * ETHIO AI HUB - Ethio Academy
 * Educational course portal with fixed curriculum published by Admin.
 * Business subscribers receive access to all courses automatically.
 * Free/Premium users can enroll via TeleBirr payment request.
 * AI provides "Ask the Teacher" chat and interactive quizzes.
 * Generates official Participation Certificate on course completion.
 */

window.EthioTools_EthioAcademy = (function() {
  let selectedCourse = null;
  let activeLessonIndex = 0;

  // Fixed published courses
  const defaultCourses = [
    {
      id: 'course_ict_101',
      title: 'የኮምፒውተርና የዌብ ቴክኖሎጂ መሰረታዊ ክህሎቶች (Web & ICT Fundamentals)',
      description: 'በኢትዮጵያ ውስጥ ተፈላጊ የሆኑ የዌብ ሳይት ስራ፣ የኮምፒውተር ደህንነት እና የዲጂታል መሳሪያዎች ተግባራዊ ስልጠና።',
      price: 450,
      language: 'Amharic & English',
      published: true,
      lessons: [
        {
          title: 'ምዕራፍ 1፡ የኢንተርኔት እና የዌብ አሰራር መርሆዎች',
          content: 'ኢንተርኔት በዓለም ዙሪያ የሚገኙ ኮምፒውተሮች እርስ በርስ የሚገናኙበት ግዙፍ ኔትወርክ ነው። የዌብ ገጾች በ HTML፣ CSS እና JavaScript አማካኝነት ተሰርተው በብራውዘር (Browser) በኩል ይታያሉ።\n\nቁልፍ ነጥቦች፡\n1. IP Address እና Domain Name (ምሳሌ፡ ethioai.et)\n2. Web Hosting እና Servers\n3. Front-end vs Back-end'
        },
        {
          title: 'ምዕራፍ 2፡ የ HTML5 እና CSS3 መሰረቶች',
          content: 'HTML5 የገጹን አጽም (Skeleton) ሲገነባ፤ CSS3 ደግሞ ውበትና ዲዛይን (Styling & Colors) ይሰጣል።\n\nተግባራዊ ልምምድ፡\n- የመዋቅር ታጎች፡ <header>, <main>, <section>, <footer>\n- የተጠቃሚ ፎርሞች፡ <input>, <button>, <select>'
        },
        {
          title: 'ምዕራፍ 3፡ የዲጂታል ደህንነት እና የይለፍ ቃል ጥበቃ',
          content: 'በመስመር ላይ ደህንነትዎን ለመጠበቅ ቢያንስ 12 ፊደላት፣ ቁጥሮች እና ምልክቶችን ያካተተ ጠንካራ የይለፍ ቃል መጠቀም ያስፈልጋል።\n\nማሳሰቢያ፡ ማንኛውንም የይለፍ ቃል ወይም የባንክ ሚስጥር ለሶስተኛ ወገን ፈጽሞ አያጋሩ።'
        }
      ]
    },
    {
      id: 'course_telecom_biz',
      title: 'የቴሌብር እና ዲጂታል ክፍያዎች ንግድ አመራር (TeleBirr & Digital Commerce)',
      description: 'የቴሌብር የንግድ መለያ አጠቃቀም፣ የሱፐር አፕ አገልግሎቶች እና የኢ-ኮሜርስ ሽያጭ በኢትዮጵያ።',
      price: 350,
      language: 'Amharic',
      published: true,
      lessons: [
        {
          title: 'ምዕራፍ 1፡ የቴሌብር መለያዎች አይነቶች',
          content: 'ቴሌብር የግል (Consumer)፣ የነጋዴ (Merchant) እና የደላላ (Agent) መለያዎችን ያቀርባል። ለንግድ ድርጅቶች የ QR ኮድ ክፍያ የጥሬ ገንዘብ ፍሰት ስጋቶችን ይቀንሳል።'
        },
        {
          title: 'ምዕራፍ 2፡ የዲጂታል ግብይት በቴሌግራም እና ቲክቶክ',
          content: 'በኢትዮጵያ ቴሌግራም ዋናው የገበያ መድረክ ነው። የቴሌግራም ቻናልና ቦት በመጠቀም ምርቶችን እንዴት ማስተዋወቅ እንደሚቻል እንመለከታለን።'
        }
      ]
    }
  ];

  function render(container) {
    const user = window.EthioAuth ? window.EthioAuth.getUser() : null;
    const profile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
    const t = window.EthioLanguage ? window.EthioLanguage.t : (k) => k;
    const plan = profile ? (profile.plan || 'free') : 'free';

    if (selectedCourse) {
      renderCourseViewer(container, selectedCourse, plan);
      return;
    }

    container.innerHTML = `
      <div class="tool-header-banner">
        <div class="tool-header-left">
          <div class="tool-header-icon" style="background-color: #ccfbf1; color: #0d9488;">
            🏫
          </div>
          <div>
            <h2 style="font-size: 1.25rem;">${t('academyTitle')}</h2>
            <p style="font-size: 0.85rem; color: var(--text-muted);">${t('academyDesc')}</p>
          </div>
        </div>
      </div>

      <!-- Business Plan Promotion Banner -->
      ${plan === 'business' ? `
        <div class="card" style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color: white; margin-bottom: 20px;">
          <h3 style="color: white; margin-bottom: 4px;">👑 የቢዝነስ እቅድ ባለቤት ስለሆኑ ሁሉም ኮርሶች በነጻ ተከፍተዋል!</h3>
          <p style="color: #a7f3d0; font-size: 0.88rem; margin: 0;">የሚፈልጉትን ኮርስ በመምረጥ አሁኑኑ መማር ይጀምሩ።</p>
        </div>
      ` : `
        <div class="card" style="background: var(--gold-light); border-color: #f59e0b; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <strong style="color: #92400e; display: block;">የቢዝነስ እቅድ (Business Plan) ይወስዳሉ?</strong>
            <span style="font-size: 0.85rem; color: #78350f;">ሁሉንም የኢትዮ አካዳሚ ኮርሶች ያለተጨማሪ ክፍያ በነጻ ያገኛሉ!</span>
          </div>
          <button id="academy-upgrade-btn" class="btn btn-gold btn-sm">እቅድ አሻሽል</button>
        </div>
      `}

      <!-- Courses Grid -->
      <div class="courses-grid">
        ${defaultCourses.map(c => {
          const hasAccess = plan === 'business';
          return `
            <div class="course-card">
              <div class="course-banner">
                <span>📚</span>
              </div>
              <div class="course-info">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <span class="badge badge-free" style="font-size: 0.7rem;">${c.language}</span>
                    <span style="font-weight: 800; color: var(--primary);">
                      ${hasAccess ? 'ነጻ (Included)' : `${c.price} ETB`}
                    </span>
                  </div>
                  <h3 style="font-size: 1.05rem; margin-bottom: 8px;">${c.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px;">
                    ${c.description}
                  </p>
                </div>
                
                <div style="border-top: 1px solid var(--border); padding-top: 12px; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-size: 0.8rem; color: var(--text-muted);">${c.lessons.length} ምዕራፎች</span>
                  <button class="btn btn-primary btn-sm view-course-btn" data-id="${c.id}">
                    ${hasAccess ? 'ኮርሱን ክፈት (Open)' : 'ይመዝገቡ (Enroll)'}
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // Handlers
    container.querySelectorAll('.view-course-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        selectedCourse = defaultCourses.find(c => c.id === id);
        activeLessonIndex = 0;
        render(container);
      });
    });

    const upBtn = document.getElementById('academy-upgrade-btn');
    if (upBtn) {
      upBtn.addEventListener('click', () => {
        window.EthioSubscription.openPaymentModal('business');
      });
    }
  }

  function renderCourseViewer(container, course, plan) {
    const hasAccess = plan === 'business';
    const lesson = course.lessons[activeLessonIndex] || course.lessons[0];

    container.innerHTML = `
      <div style="margin-bottom: 16px;">
        <button id="btn-back-courses" class="btn btn-secondary btn-sm">
          ← ወደ ሁሉም ኮርሶች ተመለስ
        </button>
      </div>

      <div style="display: grid; grid-template-columns: 280px 1fr; gap: 20px;">
        
        <!-- Lesson Syllabus Sidebar -->
        <div class="card" style="height: fit-content;">
          <h3 style="font-size: 1rem; margin-bottom: 12px; border-bottom: 1px solid var(--border); padding-bottom: 6px;">
            ${course.title}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${course.lessons.map((l, idx) => `
              <button class="btn ${idx === activeLessonIndex ? 'btn-primary' : 'btn-secondary'} btn-sm lesson-select-btn" data-idx="${idx}" style="justify-content: flex-start; text-align: left;">
                <span>${idx + 1}.</span> <span>${l.title}</span>
              </button>
            `).join('')}
          </div>

          ${activeLessonIndex === course.lessons.length - 1 ? `
            <div style="margin-top: 16px; border-top: 1px solid var(--border); padding-top: 12px;">
              <button id="btn-claim-cert" class="btn btn-gold btn-sm" style="width: 100%;">
                🎓 የተሳትፎ ምስክር ወረቀት ውሰድ
              </button>
            </div>
          ` : ''}
        </div>

        <!-- Lesson Viewer & AI Teacher Workspace -->
        <div style="display: flex; flex-direction: column; gap: 16px;">
          
          <!-- Fixed Lesson Content (Written and published by Admin) -->
          <div class="card">
            <h2 style="font-size: 1.3rem; margin-bottom: 14px; color: var(--primary);">
              ${lesson.title}
            </h2>
            <div style="white-space: pre-wrap; line-height: 1.7; font-size: 0.95rem; margin-bottom: 20px;">
              ${lesson.content}
            </div>

            <div style="display: flex; justify-content: space-between; border-top: 1px solid var(--border); padding-top: 12px;">
              <button id="btn-prev-lesson" class="btn btn-secondary btn-sm" ${activeLessonIndex === 0 ? 'disabled' : ''}>
                ← ቀዳሚ ምዕራፍ
              </button>
              <button id="btn-next-lesson" class="btn btn-primary btn-sm" ${activeLessonIndex === course.lessons.length - 1 ? 'disabled' : ''}>
                ቀጣይ ምዕራፍ →
              </button>
            </div>
          </div>

          <!-- Ask the Teacher (AI) Box -->
          <div class="card">
            <h3 style="font-size: 1.1rem; margin-bottom: 8px;">አስተማሪውን ይጠይቁ (Ask the Teacher AI)</h3>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
              ስለዚህ ምዕራፍ ያልገባዎትን ነገር ወይም የልምምድ ፈተና ጥያቄ ይጠይቁ።
            </p>

            <div class="form-group">
              <input type="text" id="teacher-q-input" placeholder="ስለዚህ ምዕራፍ ጥያቄዎን እዚህ ይጻፉ...">
            </div>

            <div style="display: flex; gap: 10px;">
              <button id="btn-ask-teacher" class="btn btn-primary btn-sm">
                <span>💬</span> <span>አስተማሪውን ጠይቅ</span>
              </button>
              <button id="btn-quiz-lesson" class="btn btn-secondary btn-sm">
                <span>📝</span> <span>የምዕራፉን ፈተና ስጠኝ (Quiz)</span>
              </button>
            </div>

            <div id="teacher-response-box" style="margin-top: 14px; display: none; padding: 14px; background: var(--bg-main); border-radius: var(--radius-md); font-size: 0.9rem; line-height: 1.6;"></div>
          </div>

          <!-- Certificate View Area -->
          <div id="certificate-container" style="display: none;"></div>

        </div>

      </div>
    `;

    // Handlers
    document.getElementById('btn-back-courses').addEventListener('click', () => {
      selectedCourse = null;
      render(container);
    });

    container.querySelectorAll('.lesson-select-btn').forEach(b => {
      b.addEventListener('click', () => {
        activeLessonIndex = parseInt(b.getAttribute('data-idx'));
        renderCourseViewer(container, course, plan);
      });
    });

    const prevBtn = document.getElementById('btn-prev-lesson');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (activeLessonIndex > 0) {
          activeLessonIndex--;
          renderCourseViewer(container, course, plan);
        }
      });
    }

    const nextBtn = document.getElementById('btn-next-lesson');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (activeLessonIndex < course.lessons.length - 1) {
          activeLessonIndex++;
          renderCourseViewer(container, course, plan);
        }
      });
    }

    // Ask Teacher AI
    const askTeacherBtn = document.getElementById('btn-ask-teacher');
    askTeacherBtn.addEventListener('click', async () => {
      const q = document.getElementById('teacher-q-input').value.trim();
      if (!q) return;

      askTeacherBtn.disabled = true;
      askTeacherBtn.innerHTML = `<span class="spinner"></span> በማሰብ ላይ...`;

      try {
        const prompt = `You are the teacher for the course "${course.title}", Lesson "${lesson.title}".
Lesson content: "${lesson.content}".
The student asks: "${q}".
Provide a clear, engaging explanation in Amharic directly addressing their inquiry.`;

        const res = await window.EthioAPI.callAI('ethio-academy', prompt);
        const box = document.getElementById('teacher-response-box');
        box.style.display = 'block';
        box.textContent = res;
      } catch (err) {
        alert(err.message);
      } finally {
        askTeacherBtn.disabled = false;
        askTeacherBtn.innerHTML = `<span>💬</span> <span>አስተማሪውን ጠይቅ</span>`;
      }
    });

    // Quiz generator
    const quizBtn = document.getElementById('btn-quiz-lesson');
    quizBtn.addEventListener('click', async () => {
      quizBtn.disabled = true;
      quizBtn.innerHTML = `<span class="spinner"></span> ጥያቄዎችን በማመንጨት ላይ...`;

      try {
        const prompt = `Create a 3-question multiple choice practice quiz in Amharic based on this lesson: "${lesson.content}". Show the questions first, and let the student test their knowledge.`;
        const res = await window.EthioAPI.callAI('ethio-academy', prompt);
        const box = document.getElementById('teacher-response-box');
        box.style.display = 'block';
        box.textContent = res;
      } catch (e) {
        alert(e.message);
      } finally {
        quizBtn.disabled = false;
        quizBtn.innerHTML = `<span>📝</span> <span>የምዕራፉን ፈተና ስጠኝ (Quiz)</span>`;
      }
    });

    // Certificate Generator
    const certBtn = document.getElementById('btn-claim-cert');
    if (certBtn) {
      certBtn.addEventListener('click', () => {
        const certBox = document.getElementById('certificate-container');
        const userProfile = window.EthioAuth ? window.EthioAuth.getProfile() : null;
        const name = userProfile ? userProfile.name : "ክቡር ሰልጣኝ";

        certBox.style.display = 'block';
        certBox.innerHTML = `
          <div class="certificate-box">
            <div style="font-size: 1.1rem; letter-spacing: 0.1em; text-transform: uppercase; color: #92400e; margin-bottom: 8px;">
              ETHIO AI HUB ACADEMY
            </div>
            <div class="cert-title">የተሳትፎ ምስክር ወረቀት</div>
            <div style="font-size: 1.1rem; margin-bottom: 12px;">Certificate of Participation</div>
            
            <p style="font-size: 1rem; margin-bottom: 6px;">ይህ ምስክር ወረቀት ለ፡</p>
            <h2 style="font-size: 1.8rem; color: var(--primary); font-family: Georgia, serif; margin-bottom: 12px;">
              ${name}
            </h2>
            <p style="max-width: 600px; margin: 0 auto; font-size: 0.95rem; line-height: 1.6;">
              <strong>"${course.title}"</strong> የተሰኘውን ተግባራዊ የክህሎት ስልጠና በስኬት በማጠናቀቃቸው የተሰጠ ነው።
            </p>

            <div style="margin-top: 24px; font-size: 0.85rem; color: #6b7280;">
              ቀን፡ ${new Date().toLocaleDateString()} | መለያ ቁጥር፡ CERT-${Date.now().toString().slice(-6)}
            </div>

            <div class="cert-disclaimer">
              "ማሳሰቢያ፡ ይህ የተሳትፎ ማረጋገጫ ምስክር ወረቀት ሲሆን ይፋዊ የትምህርት ዲግሪን ወይም መንግስታዊ እውቅናን አይተካም።"
            </div>
          </div>
        `;
        certBox.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  return {
    render: render
  };
})();
