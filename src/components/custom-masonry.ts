import usePrevious from "@/hooks/usePrevious";
import { useWindowSize } from "@react-hook/window-size";
import {
  MasonryScroller,
  MasonryScrollerProps,
  useContainerPosition,
  useInfiniteLoader,
  usePositioner,
  UsePositionerOptions,
  useResizeObserver,
  useScrollToIndex,
  UseScrollToIndexOptions,
} from "masonic";
import * as React from "react";

/**
 * A "batteries included" masonry grid which includes all of the implementation details below. This component is the
 * easiest way to get off and running in your app, before switching to more advanced implementations, if necessary.
 * It will change its column count to fit its container's width and will decide how many rows to render based upon
 * the height of the browser `window`.
 *
 * @param props
 */
export function CustomMasonry<Item>(
  props: MasonryProps<Item> & {
    fetchMore?: () => void;
    fetchMoreThreshold?: number;
  }
) {
  const { fetchMore } = props;
  const [lastSeenFetchMoreIndices, setLastSeenFetchMoreIndices] =
    React.useState<[number, number]>([0, 0]);

  const fetchMoreItems = React.useCallback(
    (startIndex: number, stopIndex: number) => {
      if (
        lastSeenFetchMoreIndices[0] !== startIndex &&
        lastSeenFetchMoreIndices[1] !== stopIndex
      ) {
        setLastSeenFetchMoreIndices([startIndex, stopIndex]);
        fetchMore?.();
      }
    },
    [lastSeenFetchMoreIndices, fetchMore]
  );

  const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
    isItemLoaded: (index, items) => !!items[index],
    ...(props.fetchMoreThreshold
      ? { threshold: props.fetchMoreThreshold }
      : {}),
  });

  const itemsCount = props.items.length;
  const prevItemsCount = usePrevious(itemsCount);

  const removesCount = React.useRef(0);

  const gridKeyPostfix = React.useMemo(() => {
    if (!itemsCount || !prevItemsCount) return removesCount.current;
    if (itemsCount < prevItemsCount) {
      removesCount.current += 1;
      return removesCount.current;
    }

    return removesCount.current;
  }, [itemsCount, prevItemsCount]);

  const containerRef = React.useRef<null | HTMLElement>(null);
  const windowSize = useWindowSize({
    initialWidth: props.ssrWidth,
    initialHeight: props.ssrHeight,
  });
  const containerPos = useContainerPosition(containerRef, windowSize);
  const nextProps = Object.assign(
    {
      offset: containerPos.offset,
      width: containerPos.width || windowSize[0],
      height: windowSize[1],
      containerRef,
    },
    props
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ) as any;
  nextProps.positioner = usePositioner(nextProps, [
    prevItemsCount && itemsCount < prevItemsCount,
  ]);
  nextProps.resizeObserver = useResizeObserver(nextProps.positioner);
  const scrollToIndex = useScrollToIndex(nextProps.positioner, {
    height: nextProps.height,
    offset: containerPos.offset,
    align:
      typeof props.scrollToIndex === "object"
        ? props.scrollToIndex.align
        : void 0,
  });
  const index =
    props.scrollToIndex &&
    (typeof props.scrollToIndex === "number"
      ? props.scrollToIndex
      : props.scrollToIndex.index);

  React.useEffect(() => {
    if (index !== void 0) scrollToIndex(index);
  }, [index, scrollToIndex]);

  return React.createElement(MasonryScroller, {
    key: gridKeyPostfix,
    onRender: (start: number, stop: number, items: Item[]) => {
      maybeLoadMore(start, stop, items);
      props.onRender?.(start, stop, items);
    },
    ...nextProps,
  });
}

export interface MasonryProps<Item>
  extends Omit<
      MasonryScrollerProps<Item>,
      "offset" | "width" | "height" | "containerRef" | "positioner"
    >,
    Pick<
      UsePositionerOptions,
      | "columnWidth"
      | "columnGutter"
      | "rowGutter"
      | "columnCount"
      | "maxColumnCount"
    > {
  /**
   * Scrolls to a given index within the grid. The grid will re-scroll
   * any time the index changes.
   */
  scrollToIndex?:
    | number
    | {
        index: number;
        align: UseScrollToIndexOptions["align"];
      };
  /**
   * This is the width that will be used for the browser `window` when rendering this component in SSR.
   * This prop isn't relevant for client-side only apps.
   */
  ssrWidth?: number;
  /**
   * This is the height that will be used for the browser `window` when rendering this component in SSR.
   * This prop isn't relevant for client-side only apps.
   */
  ssrHeight?: number;
  /**
   * This determines how often (in frames per second) to update the scroll position of the
   * browser `window` in state, and as a result the rate the masonry grid recalculates its visible cells.
   * The default value of `12` has been very reasonable in my own testing, but if you have particularly
   * heavy `render` components it may be prudent to reduce this number.
   *
   * @default 12
   */
  scrollFps?: number;
}
