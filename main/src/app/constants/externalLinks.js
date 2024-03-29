/*
 * This file is part of MystudiesMyteaching application.
 *
 * MystudiesMyteaching application is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * MystudiesMyteaching application is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with MystudiesMyteaching application.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

angular.module('constants.externalLinks', [])

  .constant('primaryLinks', {
    local: [
      {
        key: 'primaryLinks.sisu',
        domain: ['opetukseni'],
        href: {
          fi: 'https://sisu.helsinki.fi/teacher',
          sv: 'https://sisu.helsinki.fi/teacher',
          en: 'https://sisu.helsinki.fi/teacher'
        }
      },
      {
        key: 'primaryLinks.teaching',
        domain: ['opetukseni'],
        href: {
          fi: 'https://teaching.helsinki.fi/fi',
          sv: 'https://teaching.helsinki.fi/sv',
          en: 'https://teaching.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.guide',
        domain: ['opetukseni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.courseSearch',
        domain: ['opintoni', 'opetukseni'],
        href: {
          fi: 'http://local.studies.helsinki.fi:8060/opintotarjonta',
          sv: 'http://local.studies.helsinki.fi:8060/studieutbud',
          en: 'http://local.studies.helsinki.fi:8060/courses'
        }
      },
      {
        // Repeated because order of links is different between opintoni and opetukseni
        key: 'primaryLinks.guide',
        domain: ['opintoni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.tools',
        domain: ['opintoni'],
        href: {
          fi: '#',
          sv: '#',
          en: '#'
        },
        subMenu: [
          {
            key: 'primaryLinks.completedStudies',
            href: {
              fi: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=1',
              sv: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=2',
              en: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=6'
            }
          },
          {
            key: 'primaryLinks.email',
            href: {
              fi: 'http://www.helsinki.fi/office365',
              sv: 'http://www.helsinki.fi/office365',
              en: 'http://www.helsinki.fi/office365'
            }
          },
          {
            key: 'primaryLinks.library',
            href: {
              fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/',
              sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
              en: 'http://www.helsinki.fi/kirjasto/en/home/'
            }
          },
          {
            key: 'primaryLinks.dictionary',
            href: {
              fi: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              sv: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              en: 'https://mot.kielikone.fi/finelib/netmot.shtml'
            }
          }
        ]
      }
    ],
    dev: [
      {
        key: 'primaryLinks.sisu',
        domain: ['opetukseni'],
        href: {
          fi: 'https://sisu.helsinki.fi/teacher',
          sv: 'https://sisu.helsinki.fi/teacher',
          en: 'https://sisu.helsinki.fi/teacher'
        }
      },
      {
        key: 'primaryLinks.teaching',
        domain: ['opetukseni'],
        href: {
          fi: 'https://teaching.helsinki.fi/fi',
          sv: 'https://teaching.helsinki.fi/sv',
          en: 'https://teaching.helsinki.fi/en'
        }
      },

      {
        key: 'primaryLinks.guide',
        domain: ['opetukseni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.courseSearch',
        domain: ['opintoni', 'opetukseni'],
        href: {
          fi: 'https://studies-qa.it.helsinki.fi/opintotarjonta',
          sv: 'https://studies-qa.it.helsinki.fi/studieutbud',
          en: 'https://studies-qa.it.helsinki.fi/courses'
        }
      },
      {
        // Repeated because order of links is different between opintoni and opetukseni
        key: 'primaryLinks.guide',
        domain: ['opintoni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.tools',
        domain: ['opintoni'],
        href: {
          fi: '#',
          sv: '#',
          en: '#'
        },
        subMenu: [
          {
            key: 'primaryLinks.completedStudies',
            href: {
              fi: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=1',
              sv: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=2',
              en: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=6'
            }
          },
          {
            key: 'primaryLinks.email',
            href: {
              fi: 'http://www.helsinki.fi/office365',
              sv: 'http://www.helsinki.fi/office365',
              en: 'http://www.helsinki.fi/office365'
            }
          },
          {
            key: 'primaryLinks.library',
            href: {
              fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/',
              sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
              en: 'http://www.helsinki.fi/kirjasto/en/home/'
            }
          },
          {
            key: 'primaryLinks.dictionary',
            href: {
              fi: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              sv: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              en: 'https://mot.kielikone.fi/finelib/netmot.shtml'
            }
          }
        ]
      }
    ],
    qa: [
      {
        key: 'primaryLinks.sisu',
        domain: ['opetukseni'],
        href: {
          fi: 'https://sisu.helsinki.fi/teacher',
          sv: 'https://sisu.helsinki.fi/teacher',
          en: 'https://sisu.helsinki.fi/teacher'
        }
      },
      {
        key: 'primaryLinks.teaching',
        domain: ['opetukseni'],
        href: {
          fi: 'https://teaching.helsinki.fi/fi',
          sv: 'https://teaching.helsinki.fi/sv',
          en: 'https://teaching.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.guide',
        domain: ['opetukseni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.courseSearch',
        domain: ['opintoni', 'opetukseni'],
        href: {
          fi: 'https://studies-qa.it.helsinki.fi/opintotarjonta',
          sv: 'https://studies-qa.it.helsinki.fi/studieutbud',
          en: 'https://studies-qa.it.helsinki.fi/courses'
        }
      },
      {
        // Repeated because order of links is different between opintoni and opetukseni
        key: 'primaryLinks.guide',
        domain: ['opintoni'],
        href: {
          fi: 'https://dev.guide.student.helsinki.fi/fi',
          sv: 'https://dev.guide.student.helsinki.fi/sv',
          en: 'https://dev.guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.tools',
        domain: ['opintoni'],
        href: {
          fi: '#',
          sv: '#',
          en: '#'
        },
        subMenu: [
          {
            key: 'primaryLinks.completedStudies',
            href: {
              fi: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=1',
              sv: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=2',
              en: 'https://weboodi.helsinki.fi/hytest/omatopinn.jsp?NaytSuor=1&Kieli=6'
            }
          },
          {
            key: 'primaryLinks.email',
            href: {
              fi: 'http://www.helsinki.fi/office365',
              sv: 'http://www.helsinki.fi/office365',
              en: 'http://www.helsinki.fi/office365'
            }
          },
          {
            key: 'primaryLinks.library',
            href: {
              fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/',
              sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
              en: 'http://www.helsinki.fi/kirjasto/en/home/'
            }
          },
          {
            key: 'primaryLinks.dictionary',
            href: {
              fi: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              sv: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              en: 'https://mot.kielikone.fi/finelib/netmot.shtml'
            }
          }
        ]
      }
    ],
    demo: [
      {
        key: 'primaryLinks.sisu',
        domain: ['opetukseni'],
        href: {
          fi: 'https://sisu.helsinki.fi/teacher',
          sv: 'https://sisu.helsinki.fi/teacher',
          en: 'https://sisu.helsinki.fi/teacher'
        }
      },
      {
        key: 'primaryLinks.teaching',
        domain: ['opetukseni'],
        href: {
          fi: 'https://teaching.helsinki.fi/fi',
          sv: 'https://teaching.helsinki.fi/sv',
          en: 'https://teaching.helsinki.fi/en'
        }
      },

      {
        key: 'primaryLinks.guide',
        domain: ['opetukseni'],
        href: {
          fi: 'https://guide.student.helsinki.fi/fi',
          sv: 'https://guide.student.helsinki.fi/sv',
          en: 'https://guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.courseSearch',
        domain: ['opintoni', 'opetukseni'],
        href: {
          fi: 'https://studies.helsinki.fi/opintotarjonta',
          sv: 'https://studies.helsinki.fi/studieutbud',
          en: 'https://studies.helsinki.fi/courses'
        }
      },
      {
        // Repeated because order of links is different between opintoni and opetukseni
        key: 'primaryLinks.guide',
        domain: ['opintoni'],
        href: {
          fi: 'https://guide.student.helsinki.fi/fi',
          sv: 'https://guide.student.helsinki.fi/sv',
          en: 'https://guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.tools',
        domain: ['opintoni'],
        href: {
          fi: '#',
          sv: '#',
          en: '#'
        },
        subMenu: [
          {
            key: 'primaryLinks.completedStudies',
            href: {
              fi: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=1',
              sv: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=2',
              en: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=6'
            }
          },
          {
            key: 'primaryLinks.email',
            href: {
              fi: 'http://www.helsinki.fi/office365',
              sv: 'http://www.helsinki.fi/office365',
              en: 'http://www.helsinki.fi/office365'
            }
          },
          {
            key: 'primaryLinks.library',
            href: {
              fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/',
              sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
              en: 'http://www.helsinki.fi/kirjasto/en/home/'
            }
          },
          {
            key: 'primaryLinks.dictionary',
            href: {
              fi: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              sv: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              en: 'https://mot.kielikone.fi/finelib/netmot.shtml'
            }
          }
        ]
      }
    ],
    prod: [
      {
        key: 'primaryLinks.sisu',
        domain: ['opetukseni'],
        href: {
          fi: 'https://sisu.helsinki.fi/teacher',
          sv: 'https://sisu.helsinki.fi/teacher',
          en: 'https://sisu.helsinki.fi/teacher'
        }
      },
      {
        key: 'primaryLinks.teaching',
        domain: ['opetukseni'],
        href: {
          fi: 'https://teaching.helsinki.fi/fi',
          sv: 'https://teaching.helsinki.fi/sv',
          en: 'https://teaching.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.guide',
        domain: ['opetukseni'],
        href: {
          fi: 'https://guide.student.helsinki.fi/fi',
          sv: 'https://guide.student.helsinki.fi/sv',
          en: 'https://guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.courseSearch',
        domain: ['opintoni', 'opetukseni'],
        href: {
          fi: 'https://studies.helsinki.fi/opintotarjonta',
          sv: 'https://studies.helsinki.fi/studieutbud',
          en: 'https://studies.helsinki.fi/courses'
        }
      },
      {
        // Repeated because order of links is different between opintoni and opetukseni
        key: 'primaryLinks.guide',
        domain: ['opintoni'],
        href: {
          fi: 'https://guide.student.helsinki.fi/fi',
          sv: 'https://guide.student.helsinki.fi/sv',
          en: 'https://guide.student.helsinki.fi/en'
        }
      },
      {
        key: 'primaryLinks.tools',
        domain: ['opintoni'],
        href: {
          fi: '#',
          sv: '#',
          en: '#'
        },
        subMenu: [
          {
            key: 'primaryLinks.completedStudies',
            href: {
              fi: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=1',
              sv: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=2',
              en: 'https://weboodi.helsinki.fi/hy/omatopinn.jsp?NaytSuor=1&Kieli=6'
            }
          },
          {
            key: 'primaryLinks.email',
            href: {
              fi: 'http://www.helsinki.fi/office365',
              sv: 'http://www.helsinki.fi/office365',
              en: 'http://www.helsinki.fi/office365'
            }
          },
          {
            key: 'primaryLinks.library',
            href: {
              fi: 'http://www.helsinki.fi/kirjasto/fi/etusivu/',
              sv: 'http://www.helsinki.fi/kirjasto/sv/hem/',
              en: 'http://www.helsinki.fi/kirjasto/en/home/'
            }
          },
          {
            key: 'primaryLinks.dictionary',
            href: {
              fi: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              sv: 'https://mot.kielikone.fi/finelib/netmot.shtml',
              en: 'https://mot.kielikone.fi/finelib/netmot.shtml'
            }
          }
        ]
      }
    ]
  })

  .constant('pageFooterLinks', [
    {
      key: 'pageFooterLinks.contact',
      href: {
        fi: 'https://www.helsinki.fi/fi/yliopisto/henkilohaku',
        sv: 'https://www.helsinki.fi/sv/universitetet/personsokning',
        en: 'https://www.helsinki.fi/en/university/people-finder'
      }
    },
    {
      key: 'pageFooterLinks.library',
      href: {
        fi: 'http://www.helsinki.fi/kirjasto',
        sv: 'http://www.helsinki.fi/kirjasto/sv',
        en: 'http://www.helsinki.fi/kirjasto/en'
      }
    },
    {
      key: 'pageFooterLinks.flamma',
      href: {
        fi: 'https://flamma.helsinki.fi/',
        sv: 'https://flamma.helsinki.fi/sv',
        en: 'https://flamma.helsinki.fi/en'
      }
    },
    {
      key: 'pageFooterLinks.accessibility',
      href: {
        fi: 'https://teaching.helsinki.fi/ohjeet/artikkeli/opetukseni-sivun-saavutettavuusseloste',
        sv: 'https://teaching.helsinki.fi/instruktioner/artikel/tillganglighetsutlatande-min-undervisning',
        en: 'https://teaching.helsinki.fi/instructions/article/accessibility-statement-my-teaching'
      }
    }
  ]);
