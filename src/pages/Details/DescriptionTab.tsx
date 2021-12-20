import { FC, HTMLProps } from 'react';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import { Activity } from '@/types';
import styles from './index.module.less';

interface Props extends HTMLProps<HTMLDivElement> {
  activities: Activity[];
}

export const DescriptionTab: FC<Props> = ({ className, activities, ...rest }) => {
  const params = useParams<{ index: string }>();
  const index = parseInt(params.index, 10);
  const activity = activities[index];
  if (!activity) return null;
  return (
    <div className={classnames(className, styles.description)} {...rest}>
      {activity.body}
    </div>
  );
};
