import { useModel, Models } from 'umi';

// 全局连接Model
let connectModel = (key:string, name:Models<any>) => {
    return (WrappedComponent:any) => {
      return (props:{}) => {
        const model = useModel(name);
        const data = { [key]: model[key] };
        return <WrappedComponent {...props} {...data} />;
      };
    };
};

export default connectModel;