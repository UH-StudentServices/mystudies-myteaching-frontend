angular.module('services.portfolioRole', [])

  .constant('PortfolioRole', {
    'STUDENT': 'student',
    'TEACHER': 'teacher'
  })

  .factory('PortfolioRoleService', function($location, PortfolioRole) {
    var host = $location.host();

    function isInRole(portfolioRole) {
      return host.indexOf(portfolioRole) > -1;
    }

    function getPortfolioRoleFromDomain() {
      return isInRole(PortfolioRole.TEACHER) ? PortfolioRole.TEACHER : PortfolioRole.STUDENT;
    }

    return {
      getPortfolioRoleFromDomain: getPortfolioRoleFromDomain,
      isInRole: isInRole
    };
  });