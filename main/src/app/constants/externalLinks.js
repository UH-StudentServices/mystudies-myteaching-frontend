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
        key: 'primaryLinks.oodi',
        domain: ['opetukseni'],
        href: {
          fi: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=1',
          sv: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=2',
          en: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=6'
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
          fi: 'https://dev.courses.helsinki.fi/fi/search',
          sv: 'https://dev.courses.helsinki.fi/sv/search',
          en: 'https://dev.courses.helsinki.fi/search'
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
        key: 'primaryLinks.oodi',
        domain: ['opetukseni'],
        href: {
          fi: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=1',
          sv: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=2',
          en: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=6'
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
          fi: 'https://dev.courses.helsinki.fi/fi/search',
          sv: 'https://dev.courses.helsinki.fi/sv/search',
          en: 'https://dev.courses.helsinki.fi/search'
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
        key: 'primaryLinks.oodi',
        domain: ['opetukseni'],
        href: {
          fi: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=1',
          sv: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=2',
          en: 'https://weboodi.helsinki.fi/hytest/etusivu.html?Kieli=6'
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
          fi: 'https://dev.courses.helsinki.fi/fi/search',
          sv: 'https://dev.courses.helsinki.fi/sv/search',
          en: 'https://dev.courses.helsinki.fi/search'
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
        key: 'primaryLinks.oodi',
        domain: ['opetukseni'],
        href: {
          fi: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=1',
          sv: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=2',
          en: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=6'
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
          fi: 'https://demo.courses.helsinki.fi/fi/search',
          sv: 'https://demo.courses.helsinki.fi/sv/search',
          en: 'https://demo.courses.helsinki.fi/search'
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
        key: 'primaryLinks.oodi',
        domain: ['opetukseni'],
        href: {
          fi: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=1',
          sv: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=2',
          en: 'https://weboodi.helsinki.fi/hy/alkusivu.jsp?Kieli=6'
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
          fi: 'https://courses.helsinki.fi/fi/search',
          sv: 'https://courses.helsinki.fi/sv/search',
          en: 'https://courses.helsinki.fi/search'
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
  });
