import { cn } from '../../lib/utils';

type softAny =
  | Record<string, string>
  | Record<string, number>
  | Record<string, boolean>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | Record<string, any>;

interface WrapListProps<T extends softAny> {
  items: T[];
  keyField: string;
  valueField: string;
  selected: string;
  onSelect: (item: T) => void;
}

interface WrapListItemProps<T extends softAny> {
  item: T;
  keyField: string;
  valueField: string;
  /** Key of the selected item */
  selected: string;
  onSelect: (item: T) => void;
  className?: string;
}

type WrapListType = <T extends softAny>(props: WrapListProps<T>) => JSX.Element;
type WrapListItemType = <T extends softAny>(
  props: WrapListItemProps<T>
) => JSX.Element;

export const WrapListItem: WrapListItemType = ({
  item,
  keyField,
  valueField,
  selected,
  onSelect,
  className,
}) => {
  return (
    <span
      className={cn(
        'text-sm px-4 py-2 ring-1 ring-muted rounded-md hover:bg-muted cursor-pointer',
        selected === item?.[keyField] && 'ring-primary',
        className
      )}
      onClick={() => onSelect(item)}
    >
      {item?.[valueField]}
    </span>
  );
};

const WrapList: WrapListType = ({
  items,
  selected,
  onSelect,
  keyField,
  valueField,
}) => {
  return (
    <>
      {items.map((item) => (
        <WrapListItem
          key={item?.[keyField]}
          keyField={keyField}
          valueField={valueField}
          item={item}
          selected={selected}
          onSelect={onSelect}
        />
      ))}
    </>
  );
};

export default WrapList;
