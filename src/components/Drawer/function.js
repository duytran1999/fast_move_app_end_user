import { actCreateOrderTransport } from '../../actions/actionLocation'

export const listFunction = [
    {
        id: '1',
        name: 'Thêm Đơn Hàng',
        icon: require('../../assets/icon/plus.png'),
        actions: actCreateOrderTransport()
    },
    {
        id: '2',
        name: 'Quản Lý Đơn Hàng',
        icon: require('../../assets/icon/gear.png')
    },
    {
        id: '3',
        name: 'Thông Báo',
        icon: require('../../assets/icon/bell.png')
    },
    {
        id: '4',
        name: 'Trợ Giúp',
        icon: require('../../assets/icon/help.png')
    },
    {
        id: '5',
        name: 'Liên Hệ',
        icon: require('../../assets/icon/contact.png')
    },

]