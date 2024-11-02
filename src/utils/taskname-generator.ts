import { format } from 'date-fns';
import { RequestEntity } from 'src/entities/request.entity';

class TaskNameGenerator {
  static generateWarranty(request: RequestEntity) {
    const date = format(new Date(request.createdAt), 'ddMMyyyy');
    const no_issues = request?.issues.length.toString() ?? '';
    const machineModelName = request?.device?.machineModel?.name ?? '';
    const areaName = request?.device?.area?.name ?? '';
    const randomCharacters = Math.random().toString(36).substring(2, 6);

    return `${date}_BH${no_issues}_${areaName}_${machineModelName}_${randomCharacters}`;
  }
}

export default TaskNameGenerator;