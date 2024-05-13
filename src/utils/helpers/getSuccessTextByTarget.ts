import { UserActionTargetsType } from "../types";

export const getSuccessTextByTarget = (target: UserActionTargetsType) => {
    switch (target) {
        case 'answer_adding':
            return 'Відповідь успішно додана'
        case 'changing_info':
            return ' Публікація успішно змінена'
        case 'post_adding':
            return 'Питання успішно додано'
        case 'answer_deleting':
            return 'Відповідь успішно видалена'
        case 'post_deleting':
            return 'Питання успішно видалено'
        case 'post_editing':
            return 'Відповідь успішно змінена'
    }
}