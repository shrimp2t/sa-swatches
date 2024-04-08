```js
import {  useEffect , useMemo, useContext, createPortal } from '@wordpress/element';
```

### useMemo
Bất cứ khi nào  giá trị thay đổi. Tương tự như useCallback, useMemo được được sử dụng để giảm bớt số lần render.


### useEffect
Bất cứ khi nào có giá trị thay đổi và và các logic cần thay đổi để phản ứng với các giá trị đó. Ví dụ như việc gọi lại slider.

Bất cứ khi nào bạn có một số logic được thực thi như phản ứng với một sự thay đổi trạng thái hoặc trước khi một sự thay đổi sắp xảy ra.


### useCallback:

Bất cứ khi nào bạn có một chức năng phụ thuộc vào các trạng thái nhất định. Móc này là để tối ưu hóa hiệu suất và ngăn một chức năng bên trong thành phần của bạn được chỉ định lại trừ khi trạng thái phụ thuộc được thay đổi.