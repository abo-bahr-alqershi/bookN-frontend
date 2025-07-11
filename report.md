
# تقرير تحليل تناقضات ونواقص الواجهة الأمامية (Frontend)

## مقدمة

يهدف هذا التقرير إلى تحليل شامل للكود المصدري للواجهة الأمامية، مع التركيز على مقارنة ملفات الخدمات (`/src/services`) وملفات الأنواع (`/src/types`) مع ملف توثيق نقاط النهاية (`endpoints.txt`). تم تحديد عدد من النواقص، الزوائد، والتناقضات التي تحتاج إلى مراجعة لضمان توافق الكود مع التوثيق وتحسين صيانته المستقبلية.

---

## 1. نقاط النهاية المفقودة في ملف `endpoints.txt`

هذه القائمة تحتوي على نقاط النهاية التي تم تنفيذها في ملفات الخدمات ولكنها غير موجودة في ملف التوثيق `endpoints.txt`.

### Admin Endpoints
- **`admin-actions.service.ts`**
  - `GET /api/admin-actions`
  - `GET /api/admin-actions/{actionId}`
- **`payments.service.ts`**
  - `GET /api/admin/payments/booking/{bookingId}`
  - `GET /api/admin/payments/method/{paymentMethod}`
  - `GET /api/admin/payments/status`
  - `GET /api/admin/payments/user/{userId}`
- **`reviews.service.ts`**
  - `POST /api/admin/reviews` (موجودة ضمنياً لكن بدون توثيق رسمي للـ POST)
- **`roles.service.ts`**
  - `GET /api/admin/roles/{roleId}`
- **`unit-types.service.ts`**
  - `GET /api/admin/unittypes`
- **`units.service.ts`**
  - `GET /api/admin/units`

### Property Endpoints
- **`property-bookings.service.ts`**
  - `GET /api/property/Bookings` (الرئيسي لجلب كل الحجوزات)
- **`unit-type-fields.service.ts`**
  - `GET /api/property/property-type-fields/property-type/{propertyTypeId}`
  - `GET /api/property/property-type-fields/{fieldId}`
  - `GET /api/property/property-type-fields/grouped`

---

## 2. نقاط النهاية الزائدة أو غير المستخدمة

هذه القائمة تحتوي على نقاط النهاية المذكورة في `endpoints.txt` ولكن لا يوجد لها استدعاء مباشر أو واضح في ملفات الخدمات التي تم تحليلها. قد تكون مستخدمة في أجزاء أخرى من التطبيق لم يتم تحليلها أو أنها زائدة.

### Admin Endpoints
- `POST /api/admin/dashboard/dashboard`
- `POST /api/admin/dashboard/dashboard/export`
- `GET /api/admin/dashboard/dashboard/customer-report`
- `GET /api/admin/dashboard/dashboard/financial-summary`
- `POST /api/admin/dashboard/dashboard/performance`
- `POST /api/admin/dashboard/dashboard/performance-comparison`
- `POST /api/admin/dashboard/dashboard/occupancy-rate`
- `POST /api/admin/dashboard/dashboard/occupancy-report`
- `POST /api/admin/dashboard/dashboard/revenue-report`
- `POST /api/admin/dashboard/dashboard/cancellation-analysis`
- `POST /api/admin/dashboard/dashboard/revenue-breakdown`
- `POST /api/admin/dashboard/dashboard/user-acquisition-funnel`
- `POST /api/admin/dashboard/dashboard/customer-cohort-analysis`
- `GET /api/admin/dashboard/dashboard/review-sentiment-analysis/{propertyId}`
- `GET /api/admin/dashboard/dashboard/top-properties/{count}`
- `POST /api/admin/staff/add`
- `PUT /api/admin/staff/update`
- `POST /api/admin/staff/remove`
- `GET /api/admin/staff/by-position`
- `GET /api/admin/staff/by-property`
- `GET /api/admin/staff/by-user`
- `POST /api/admin/uploadimage`

### Property Endpoints
- `POST /api/property/dashboard/dashboard/owner`
- `POST /api/property/dashboard/dashboard/export`
- `GET /api/property/dashboard/dashboard/customer-report`
- `GET /api/property/dashboard/dashboard/financial-summary`
- `POST /api/property/dashboard/dashboard/performance`
- `POST /api/property/dashboard/dashboard/performance-comparison`
- `POST /api/property/dashboard/dashboard/occupancy-rate`
- `POST /api/property/dashboard/dashboard/occupancy-report`
- `POST /api/property/dashboard/dashboard/revenue-report`
- `POST /api/property/dashboard/dashboard/cancellation-analysis`
- `POST /api/property/dashboard/dashboard/revenue-breakdown`
- `POST /api/property/dashboard/dashboard/user-acquisition-funnel`
- `GET /api/property/dashboard/dashboard/top-properties/{count}`
- `POST /api/property/staff/add`
- `PUT /api/property/staff/update`
- `POST /api/property/staff/remove`
- `GET /api/property/staff/by-position`
- `GET /api/property/staff/by-property`
- `GET /api/property/staff/by-user`
- `POST /api/property/uploadimage`

### Common Endpoints
- `POST /api/common/search/properties`
- `POST /api/common/search/units`
- `PUT /api/common/users/profile-picture`
- `PUT /api/common/users/settings`

---

## 3. التناقضات والاختلافات

### أ. اختلاف في مسارات URL
- **مسار المصادقة (Auth)**:
  - **الكود:** `auth.service.ts` يستخدم المسار `/api/auth/login`.
  - **التوثيق:** `endpoints.txt` يذكر المسار كـ `/api/common/auth/login`.
  - **النتيجة:** يوجد اختلاف في الجزء `auth` مقابل `common/auth`.

### ب. اختلاف في حالة الأحرف (Case-Sensitivity)
توجد اختلافات كثيرة في حالة الأحرف بين أسماء الـ Controllers في `endpoints.txt` والمسارات الفعلية المستخدمة في ملفات الخدمات. هذا قد يسبب أخطاء في بيئات التشغيل الحساسة لحالة الأحرف.
- **مثال 1:**
  - **الكود:** `admin-property-images.service.ts` يستخدم `.../api/admin/PropertyImages/...` (حرف `P` كبير).
  - **التوثيق:** `endpoints.txt` يذكرها كـ `.../api/admin/propertyimages/...` (حرف `p` صغير).
- **مثال 2:**
  - **الكود:** `audit-logs.service.ts` يستخدم `.../api/admin/AuditLogs/...` (حرف `A` و `L` كبير).
  - **التوثيق:** `endpoints.txt` يذكرها كـ `.../api/admin/auditlogs/...` (أحرف صغيرة).
- **ملاحظة:** هذا النمط يتكرر في معظم الخدمات مثل `FieldGroups`, `FieldTypes`, `Bookings` وغيرها.

### ج. اختلاف في أسماء المعلمات (URL Parameters)
- **مثال 1 (`amenities.service.ts`):**
  - **الكود:** الدوال تستخدم `amenityId` كمتغير.
  - **التوثيق:** `PUT /api/admin/amenities/{amenityId}` (صحيح)، لكن في أماكن أخرى قد يوجد عدم تطابق.
- **مثال 2 (`units.service.ts`):**
  - **الكود:** الدوال تستخدم `unitId` كمتغير.
  - **التوثيق:** `DELETE /api/admin/units/{id}` يستخدم `{id}` بدلاً من `{unitId}`.
- **مثال 3 (`reports.service.ts`):**
  - **الكود:** الدالة `delete` تستخدم `id`.
  - **التوثيق:** `DELETE /api/admin/reports/{reportId}` يستخدم `{reportId}`.

### د. عدم تطابق بين الأنواع (`types`) والخدمات (`services`)
- **`admin-action.types.ts`**: يعرف `AdminActionDto` ولكن الخدمة `admin-actions.service.ts` غير مكتملة ولا تستخدم كل الأنواع.
- **`dashboard.types.ts`**: يعرف أنواعًا مثل `GetAdminDashboardQuery` و `OwnerDashboardQuery` ولكن لا توجد خدمات واضحة تستخدمها، مما يتوافق مع قسم "نقاط النهاية الزائدة".
- **`review.types.ts`**: النوع `CreateReviewCommand` يُستخدم في `reviews.service.ts` لإنشاء تقييم جديد، ولكن نقطة النهاية `POST /api/admin/reviews` غير موثقة بشكل صريح في `endpoints.txt`.

---

## 4. توصيات

1.  **تحديث `endpoints.txt`:**
    - إضافة جميع نقاط النهاية المفقودة من القسم (1) إلى ملف `endpoints.txt` لتوثيقها بشكل كامل.
    - مراجعة نقاط النهاية الزائدة في القسم (2). إذا كانت غير مستخدمة فعليًا، يجب إزالتها من التوثيق لتجنب الالتباس. أما إذا كانت مستخدمة في مكان آخر، فيجب توثيق ذلك.

2.  **توحيد مسارات URL:**
    - يجب توحيد المسارات بين الكود والتوثيق. القرار يجب أن يتخذ حول ما إذا كان مسار المصادقة يجب أن يكون تحت `/auth` أو `/common/auth` وتطبيقه في كل مكان.
    - توحيد حالة الأحرف في جميع المسارات. **التوصية الأفضل هي استخدام الأحرف الصغيرة (lowercase) مع الفصل بـ `-` (kebab-case)** لأسماء المسارات لتجنب أي مشاكل متعلقة بحالة الأحرف، مثلاً `property-images` بدلاً من `PropertyImages`.

3.  **توحيد أسماء المعلمات:**
    - يجب مراجعة جميع نقاط النهاية والتأكد من أن أسماء المعلمات (e.g., `{id}`, `{userId}`, `{propertyId}`) متطابقة بين ملفات الخدمات والتوثيق.

4.  **مراجعة الأنواع والخدمات:**
    - التأكد من أن كل `Command` و `Query` معرف في مجلد `types` له استخدام فعلي في الخدمات.
    - إزالة الأنواع غير المستخدمة لتقليل حجم الكود المصدري.

بتطبيق هذه التوصيات، سيصبح الكود أكثر تناسقًا وسهولة في الصيانة، وسيكون التوثيق مرجعًا دقيقًا وموثوقًا للمطورين.
