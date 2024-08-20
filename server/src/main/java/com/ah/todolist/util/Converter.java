package com.ah.todolist.util;

import java.util.Date;
import java.util.concurrent.TimeUnit;

public class Converter {

    public static Date timestampToDate(Long date) {
        return date == null ? null : new Date(TimeUnit.SECONDS.toMillis(date));
    }

    public static Long dateToTimestamp(Date date) {
        return date == null ? null : TimeUnit.MILLISECONDS.toSeconds(date.getTime());
    }

}
