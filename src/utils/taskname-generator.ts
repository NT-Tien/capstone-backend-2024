import { format } from 'date-fns';
import { RequestEntity } from 'src/entities/request.entity';

class TaskNameGenerator {
  static generateWarranty(request: RequestEntity) {
    const date = format(new Date(request.createdAt), 'ddMMyyyy');
    const no_issues = request?.issues.length.toString() ?? '';
    const areaName = request?.device?.area?.name ?? '';
    const randomCharacters = Math.random().toString(36).substring(2, 6);
    const requestCodeSplit = request.code.split('_');
    const requestCodeUnique = requestCodeSplit[requestCodeSplit.length - 1];

    return `${date}_BH${no_issues}_${areaName}_${requestCodeUnique}_${randomCharacters.toUpperCase()}`;
  }

  static generateRenew(request: RequestEntity) {
    const date = format(new Date(request.createdAt), 'ddMMyyyy');
    const no_issues = request?.issues.length.toString() ?? '';
    const areaName = request?.device?.area?.name ?? '';
    const randomCharacters = Math.random().toString(36).substring(0, 6);
    const requestCodeSplit = request.code.split('_');
    const requestCodeUnique = requestCodeSplit[requestCodeSplit.length - 1];

    return `${date}_RN${no_issues}_${areaName}_${requestCodeUnique}_${randomCharacters.toUpperCase()}`;
  }

  static generateInstallReplacement(request: RequestEntity) {
    const date = format(new Date(request.createdAt), 'ddMMyyyy');
    const no_issues = request?.issues.length.toString() ?? '';
    const areaName = request?.device?.area?.name ?? '';
    const randomCharacters = Math.random().toString(36).substring(0, 6);
    const requestCodeSplit = request.code.split('_');
    const requestCodeUnique = requestCodeSplit[requestCodeSplit.length - 1];

    return `${date}_IR${no_issues}_${areaName}_${requestCodeUnique}_${randomCharacters.toUpperCase()}`;
  }
}

export default TaskNameGenerator;
