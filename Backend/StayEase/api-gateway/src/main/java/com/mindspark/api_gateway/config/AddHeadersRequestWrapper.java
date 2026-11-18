package com.mindspark.api_gateway.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;

import java.util.*;

public class AddHeadersRequestWrapper extends HttpServletRequestWrapper {

    private final Map<String, String> additionalHeaders;

    public AddHeadersRequestWrapper(HttpServletRequest request, Map<String, String> additionalHeaders) {
        super(request);
        this.additionalHeaders = additionalHeaders != null ? new HashMap<>(additionalHeaders) : new HashMap<>();
    }

    @Override
    public String getHeader(String name) {
        String headerValue = additionalHeaders.get(name);
        if (headerValue != null) {
            return headerValue;
        }
        return super.getHeader(name);
    }

    @Override
    public Enumeration<String> getHeaderNames() {
        Set<String> names = new LinkedHashSet<>();
        Enumeration<String> original = super.getHeaderNames();
        if (original != null) {
            while (original.hasMoreElements()) {
                names.add(original.nextElement());
            }
        }
        names.addAll(additionalHeaders.keySet());
        return Collections.enumeration(names);
    }

    @Override
    public Enumeration<String> getHeaders(String name) {
        List<String> values = new ArrayList<>();
        String added = additionalHeaders.get(name);
        if (added != null) values.add(added);

        Enumeration<String> original = super.getHeaders(name);
        if (original != null) {
            while (original.hasMoreElements()) {
                values.add(original.nextElement());
            }
        }
        return Collections.enumeration(values);
    }
}
